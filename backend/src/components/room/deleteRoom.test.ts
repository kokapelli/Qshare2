import { default as chai, assert } from "chai";
import "mocha";
import app from "../../app";
import SECRET_KEY from "../../utils/secretKey";
import jwt from "jsonwebtoken";
import { initializeDB } from "../../db/setup/dbSetup";
import {
  MOCK_CLIENTID_2,
  MOCK_CLIENTID_1,
  MOCK_ID_1
} from "../../utils/test/insertMockUsers";
import {
  ROOM_ID_1,
} from "../../utils/test/insertMockRooms";
import Room from "../../db/models/room";
import { STATUS_SUCCESS_STR } from "../constants/success";
import { STATUS_ERROR_STR } from "../constants/error";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";

const ENDPOINT: string = "/api/room";

describe("DELETE " + ENDPOINT, () => {
  beforeEach(async () => {
    await initializeDB();
    await insertMockRoomChain();
  });

  it("should return 400 if missing token", async () => {
    const response = await chai
      .request(app)
      .del(ENDPOINT)
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
      .del(ENDPOINT)
      .set("Token", invalidToken)
      .send();
    assert.equal(response.status, 401);
  });

  it("should return 400 if roomID doesn't exists", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .del(ENDPOINT)
      .query("roomID=FAKEFAKEFAKE")
      .set("Token", token)
      .send();

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });


  it("should not be allowed to delete a room that you are not the owner of", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .del(ENDPOINT)
      .query("roomID=" + ROOM_ID_1)
      .set("Token", token)
      .send();

    assert.equal(response.status, 401);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("owner should be able to delete one of its room", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .del(ENDPOINT)
      .query("roomID=" + ROOM_ID_1)
      .set("Token", token)
      .send();

    assert.equal(response.status, 200);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);

    const dbRoom = await Room.findOne({
      where: {
        id: ROOM_ID_1
      }
    });

    assert.isNotNull(dbRoom);
    if (dbRoom) {
      assert.equal(dbRoom.get("owner"), MOCK_ID_1);
      assert.equal(dbRoom.get("isActive"), false);
    }
  });
});
