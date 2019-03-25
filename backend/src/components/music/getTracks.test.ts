import { default as chai, assert } from "chai";
import "mocha";
import app from "../../app";
import { MOCK_CLIENTID_1 } from "../../utils/test/insertMockUsers";
import { SPOTIFY_PROVIDER } from "../constants/providers";

const ENDPOINT: string = "/api/tracks";

describe("GET " + ENDPOINT, () => {
  it("should return 200 on successful query on tracks", async () => {
    const token = (await chai
        .request(app)
        .post("/api/token")
        .send({ clientID: MOCK_CLIENTID_1 })).body.token;
  
    const response = await chai
      .request(app)
      .get(ENDPOINT + "?title=ryu")
      .set("Provider", SPOTIFY_PROVIDER)
      .set("Token", token)
      .send();
      
    assert.equal(response.status, 200);
  });

  it("should return 400 if missing Provider in header", async () => {
    const response = await chai
      .request(app)
      .get(ENDPOINT + "?title=ryu")
      .send();
    assert.equal(response.status, 400);
  });

  it("should return 400 if missing query parameter title", async () => {
    const response = await chai
      .request(app)
      .get(ENDPOINT)
      .set("Provider", SPOTIFY_PROVIDER)
      .send();
    assert.equal(response.status, 400);
  });
});
