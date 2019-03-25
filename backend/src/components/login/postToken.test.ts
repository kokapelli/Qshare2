import { default as chai, assert } from "chai";
import "mocha";
import app from "../../app";
import { initializeDB } from "../../db/setup/dbSetup";
import jwt from "jsonwebtoken";
import SECRET_KEY from "../../utils/secretKey";

const ENDPOINT: string = "/api/token";

describe("POST " + ENDPOINT, () => {
  before(async () => {
    await initializeDB();
  });

  it("should return 400 if missing clientID", async () => {
    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .send();
    assert.equal(response.status, 400);
    assert.equal(response.body.status, "error");
    assert.equal(response.body.reason, "missing client ID");
  });

  it("should return 200 if successful token call", async () => {
    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .send({ clientID: "afd8-fk26" });
    assert.equal(response.status, 200);
  });

  it("should return have token keys according to documentation", async () => {
    const response = await chai
      .request(app)
      .post(ENDPOINT)
      .send({ clientID: "afd8-fk26" });

    assert.equal(response.body.status, "success");
    assert(response.body.token !== undefined);
    const decodedToken = jwt.verify(response.body.token, SECRET_KEY);
    assert.containsAllKeys(decodedToken, ["iss", "sub", "aud", "exp", "iat"]);
  });
});
