import { default as chai, assert } from "chai";
import "mocha";
import app from "../../app";
import SECRET_KEY from "../../utils/secretKey";
import jwt from "jsonwebtoken";
import { MOCK_CLIENT_ID } from "../constants/id";
import { initializeDB } from "../../db/setup/dbSetup";
import {
  MOCK_CLIENTID_2,
  MOCK_ID_2
} from "../../utils/test/insertMockUsers";
import {
  ROOM_ID_1,
  ROOM_ID_2,
  ROOM_ID_3
} from "../../utils/test/insertMockRooms";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { STATUS_SUCCESS_STR } from "../constants/success";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";

const ENDPOINT: string = "/api/room";

describe("GET " + ENDPOINT, () => {
  before(async () => {
    await initializeDB();
    await insertMockRoomChain();
  });

  it("should return 400 if missing token", async () => {
    const response = await chai
      .request(app)
      .get(ENDPOINT)
      .send();
    assert.equal(response.status, 400);
    assert.equal(response.body.status, "error");
  });

  it("should return 401 if token is expired", async () => {
    const payload = { user: "test" };
    const invalidToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1ms"
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    const response = await chai
      .request(app)
      .get(ENDPOINT)
      .set("Token", invalidToken)
      .send();
    assert.equal(response.status, 401);
    assert.equal(response.body.status, "error");
  });

  it("should return 200 if token is valid", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENT_ID })).body.token;

    const response = await chai
      .request(app)
      .get(ENDPOINT)
      .set("Token", token)
      .send();
    assert.equal(response.status, 200);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);
  });

  it("should return rooms and status", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENT_ID })).body.token;

    const response = await chai
      .request(app)
      .get(ENDPOINT)
      .set("Token", token)
      .send();

    assert.containsAllKeys(response.body, ["rooms", "status"]);
  });

  it("should return all rooms a user have joined", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .get(ENDPOINT)
      .set("Token", token)
      .send();

    chai
      .expect(response.body.rooms)
      .to.include.deep.members([
        { id: ROOM_ID_1 },
        { id: ROOM_ID_2 },
        { id: ROOM_ID_3 }
      ]);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);
  });

  it("should not return rooms that the user is banned from", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    await AssociatedUserRoom.update(
      {
        banned: true
      },
      {
        where: {
          userID: MOCK_ID_2,
          roomID: ROOM_ID_1
        }
      }
    );
    const response = await chai
      .request(app)
      .get(ENDPOINT)
      .set("Token", token)
      .send();

    chai
      .expect(response.body.rooms)
      .to.include.deep.members([{ id: ROOM_ID_2 }, { id: ROOM_ID_3 }]);

    assert.equal(response.body.status, STATUS_SUCCESS_STR);

    AssociatedUserRoom.update(
      {
        banned: false
      },
      {
        where: {
          userID: MOCK_ID_2,
          roomID: ROOM_ID_1
        }
      }
    );
  });
});
