import { default as chai, assert } from "chai";
import "mocha";
import sinon from "sinon";

import app from "../../app";
import { initializeDB } from "../../db/setup/dbSetup";
import jwt from "jsonwebtoken";
import { STATUS_SUCCESS_STR } from "../constants/success";
import { STATUS_ERROR_STR } from "../constants/error";
import {
  MOCK_CLIENTID_1,
  MOCK_CLIENTID_2,
  MOCK_CLIENTID_3,
  MOCK_ID_2,
  MOCK_ID_1,
  MOCK_ID_3
} from "../../utils/test/insertMockUsers";
import { ROOM_ID_1 } from "../../utils/test/insertMockRooms";
import { QUEUE_ID_1, QUEUE_ID_3 } from "../../utils/test/insertMockQueues";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { VALID_TRACK } from "../../utils/test/trackExamples";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";
import { SPOTIFY_PROVIDER, SPOTIFY_ACCESS_LEVEL } from "../constants/providers";
import SECRET_KEY from "../../utils/secretKey";
import Room from "../../db/models/room";
import RoomType from "../../db/types/roomType";
import { Instance } from "sequelize";
import { ProviderSpotifyQueue } from "../connector/spotify/providerSpotifyQueue";

const ENDPOINT: string = "/api/queue/:queueID";
const BASE_ENDPOINT: string = "/api/queue/";

describe("GET " + ENDPOINT, () => {
  beforeEach(async () => {
    await initializeDB();
    await insertMockRoomChain();

    sinon.stub(ProviderSpotifyQueue.prototype, "addTrack");
  });

  afterEach( () => {
    // Official way to restore stubs in sinon and TS...
    (ProviderSpotifyQueue.prototype.addTrack as any).restore();
  });

  it("should return 400 if missing token", async () => {
    const response = await chai.request(app).get(BASE_ENDPOINT + QUEUE_ID_1);
    assert.equal(response.status, 400);
  });

  it("should return 400 if queueID doesn't exists", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .get(BASE_ENDPOINT + "INVALID_QUEUE_ID")
      .set("Token", token);

    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should not be allow to get tracks of a queue that you are not a part of", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_3 })).body.token;

    const response = await chai
      .request(app)
      .get(BASE_ENDPOINT + QUEUE_ID_3)
      .set("Token", token);

    assert.equal(response.status, 401);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should not allow to add track to a queue that you are banned from", async () => {
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

    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_2 })).body.token;

    const response = await chai
      .request(app)
      .get(BASE_ENDPOINT + QUEUE_ID_1)
      .set("Token", token);

    assert.equal(response.status, 401);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should allow member of queue to be able to get tracks", async () => {
    const token = (await chai
      .request(app)
      .post("/api/token")
      .send({ clientID: MOCK_CLIENTID_1 })).body.token;

    const response = await chai
      .request(app)
      .get(BASE_ENDPOINT + QUEUE_ID_1)
      .set("Token", token);

    assert.equal(response.status, 200);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);
  });

  it("should return all added tracks", async () => {
    const payload = { sub: MOCK_ID_3, aud: ["Basic", SPOTIFY_ACCESS_LEVEL] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });

    await chai
      .request(app)
      .post("/api/room")
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send();

    const roomModel = await Room.findOne({where: {owner: MOCK_ID_3}});
    if (!roomModel) {
        assert(false);
    }

    await chai
      .request(app)
      .post(BASE_ENDPOINT + (roomModel as Instance<RoomType> ).get("queueID") + "/tracks")
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send({ track: VALID_TRACK });

    await chai
      .request(app)
      .post(BASE_ENDPOINT + (roomModel as Instance<RoomType> ).get("queueID") + "/tracks")
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send({ track: VALID_TRACK });

    const response = await chai
      .request(app)
      .get(BASE_ENDPOINT + (roomModel as Instance<RoomType> ).get("queueID"))
      .set("Token", token);

    assert.equal(response.status, 200);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);

    assert.equal(response.body.tracks.length, 2);
    assert.equal(response.body.tracks[0].position, 0);
    assert.equal(response.body.tracks[1].position, 1);
  });

  it("should return parsed track data", async () => {
    const payload = { sub: MOCK_ID_3, aud: ["Basic", SPOTIFY_ACCESS_LEVEL] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });

    await chai
      .request(app)
      .post("/api/room")
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send();

    const roomModel = await Room.findOne({where: {owner: MOCK_ID_3}});
    if (!roomModel) {
        assert(false);
    }

    await chai
      .request(app)
      .post(BASE_ENDPOINT + (roomModel as Instance<RoomType> ).get("queueID") + "/tracks")
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send({ track: VALID_TRACK });

    const response = await chai
      .request(app)
      .get(BASE_ENDPOINT + (roomModel as Instance<RoomType> ).get("queueID"))
      .set("Token", token);

    assert.equal(response.body.tracks[0].data.uri, VALID_TRACK.uri);
  });
});
