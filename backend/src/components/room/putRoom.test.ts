import { default as chai, assert } from "chai";
import "mocha";
import app from "../../app";
import SECRET_KEY from "../../utils/secretKey";
import jwt from "jsonwebtoken";
import { initializeDB } from "../../db/setup/dbSetup";
import {
  MOCK_CLIENTID_2,
  MOCK_ID_3,
  MOCK_CLIENTID_1,
  MOCK_ID_2
} from "../../utils/test/insertMockUsers";
import {
  ROOM_ID_1,
  ROOM_ID_3
} from "../../utils/test/insertMockRooms";
import { STATUS_ERROR_STR, REASON_DENIED_STR } from "../constants/error";
import { STATUS_SUCCESS_STR } from "../constants/success";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";

const ENDPOINT: string = "/api/room";

describe("PUT " + ENDPOINT, () => {
  beforeEach(async () => {
    await initializeDB();
    await insertMockRoomChain();
  });

  it("should return 400 if missing token", async () => {
    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .send();
    assert.equal(response.status, 400);
  });

  it("should return 401 if token is expired", async () => {
    const payload = { user: "test" };
    const invalidToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1ms"
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", invalidToken)
      .send();
    assert.equal(response.status, 401);
  });

  it("should return 400 if roomID is missing", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        action: "join"
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should return 400 if action is missing", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_1
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should return 400 if roomID doesn't exists", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: "FAKEFAKEFAKE",
        action: "join"
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should return 400 if userID doesn't exists", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_1,
        action: "ban",
        userID: "FAKEFAKEFAKE"
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should not be able to ban if not owner", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_1,
        action: "ban",
        userID: MOCK_ID_3
      });

    assert.equal(response.status, 401);
    assert.equal(response.body.status, STATUS_ERROR_STR);
    assert.equal(response.body.reason, REASON_DENIED_STR);
  });

  it("should not be able to unban if not owner", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_1,
        action: "unban",
        userID: MOCK_ID_3
      });

    assert.equal(response.status, 401);
    assert.equal(response.body.status, STATUS_ERROR_STR);
    assert.equal(response.body.reason, REASON_DENIED_STR);
  });

  it("should not be able to ban if user haven't joined the room", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_3,
        action: "ban",
        userID: MOCK_ID_3
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
    assert.equal(await isBanned(MOCK_ID_3, ROOM_ID_3), ban.DOESNT_EXIST);
  });

  it("should not be able to unban if user haven't joined the room", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_3,
        action: "unban",
        userID: MOCK_ID_3
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
    assert.equal(await isBanned(MOCK_ID_3, ROOM_ID_3), ban.DOESNT_EXIST);
  });

  it("owner should be able to ban a user in a room", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_1,
        action: "ban",
        userID: MOCK_ID_2
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);

    assert.equal(await isBanned(MOCK_ID_2, ROOM_ID_1), ban.BANNED);
  });

  it("owner should be able to unban a user in a room", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_1,
        action: "ban",
        userID: MOCK_ID_2
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);

    assert.equal(await isBanned(MOCK_ID_2, ROOM_ID_1), ban.BANNED);

    const response2 = await chai
      .request(app)
      .put(ENDPOINT)
      .set("Token", token)
      .send({
        roomID: ROOM_ID_1,
        action: "unban",
        userID: MOCK_ID_2
      });

    assert.equal(response2.status, 200);
    assert.equal(response2.body.status, STATUS_SUCCESS_STR);

    assert.equal(await isBanned(MOCK_ID_2, ROOM_ID_1), ban.NOT_BANNED);
  });
});

const isBanned = async (userID: string, roomID: string) => {
  const bannedDb = await AssociatedUserRoom.findOne({
    where: {
      userID,
      roomID
    }
  });

  if (bannedDb) {
    if (bannedDb.get("banned")) {
      return ban.BANNED;
    } else {
      return ban.NOT_BANNED;
    }
  } else {
    return ban.DOESNT_EXIST;
  }
};

enum ban {
  BANNED,
  NOT_BANNED,
  DOESNT_EXIST
}
