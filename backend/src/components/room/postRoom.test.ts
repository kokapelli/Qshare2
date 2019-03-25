import { default as chai, assert } from "chai";
import "mocha";
import sinon from "sinon";
import app from "../../app";
import SECRET_KEY from "../../utils/secretKey";
import jwt from "jsonwebtoken";
import { initializeDB } from "../../db/setup/dbSetup";
import { STATUS_SUCCESS_STR } from "../constants/success";
import { STATUS_ERROR_STR } from "../constants/error";
import { SPOTIFY_PROVIDER, SPOTIFY_ACCESS_LEVEL } from "../constants/providers";
import { MOCK_ID_3, } from "../../utils/test/insertMockUsers";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";
import { ProviderSpotifyQueue } from "../connector/spotify/providerSpotifyQueue";

const ENDPOINT: string = "/api/room";

describe("POST " + ENDPOINT, () => {
  beforeEach(async () => {
    await initializeDB();
    await insertMockRoomChain();

    sinon.stub(ProviderSpotifyQueue.prototype, "create");
  });

  afterEach( () => {
      // Official way to restore stubs in sinon and TS...
      (ProviderSpotifyQueue.prototype.create as any).restore();
  });

  it("should return 400 if missing token", async () => {
    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .send();
    assert.equal(response.status, 400);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should return 401 if token is expired", async () => {
    const payload = { user: "test" };
    const invalidToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1ms"
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .set("Token", invalidToken)
      .send();
    assert.equal(response.status, 401);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });

  it("should return 200 if token is valid", async () => {
    const payload = { sub: MOCK_ID_3, aud: ["Basic", SPOTIFY_ACCESS_LEVEL] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });

    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send();
    assert.equal(response.status, 200);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);
  });

  it("should return roomID and status", async () => {
    const payload = { sub: MOCK_ID_3, aud: ["Basic", SPOTIFY_ACCESS_LEVEL] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });

    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send();

    assert.containsAllKeys(response.body, ["roomID", "status"]);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);
  });

  it("should return queueID", async () => {
    const payload = { sub: MOCK_ID_3, aud: ["Basic", SPOTIFY_ACCESS_LEVEL] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });

    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send();

    assert.containsAllKeys(response.body, ["queueID", "roomID", "status"]);
    assert.equal(response.body.status, STATUS_SUCCESS_STR);
  });

  it("should return 500 on internal provider queue failure", async () => {
    const payload = { sub: MOCK_ID_3, aud: ["Basic", SPOTIFY_ACCESS_LEVEL] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });

    (ProviderSpotifyQueue.prototype.create as any).restore();
    sinon.stub(ProviderSpotifyQueue.prototype, "create").throws(new Error());

    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .set("Token", token)
      .set("Provider", SPOTIFY_PROVIDER)
      .send();

    assert.equal(response.status, 500);
    assert.equal(response.body.status, STATUS_ERROR_STR);
  });
});
