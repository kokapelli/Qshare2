import { default as chai, assert } from "chai";
import "mocha";
import sinon from "sinon";

import app from "../../app";
import { initializeDB } from "../../db/setup/dbSetup";

import { STATUS_SUCCESS_STR } from "../constants/success";
import { MOCK_ID_1, MOCK_ID_3, MOCK_CLIENTID_1 } from "../../utils/test/insertMockUsers";
import { QUEUE_ID_1 } from "../../utils/test/insertMockQueues";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";
import { ProviderSpotifyQueue } from "../connector/spotify/providerSpotifyQueue";
import { SPOTIFY_PROVIDER, SPOTIFY_ACCESS_LEVEL } from "../constants/providers";
import SECRET_KEY from "../../utils/secretKey";
import jwt from "jsonwebtoken";
import { STATUS_ERROR_STR } from "../constants/error";


const BASE_ENDPOINT: string = "/api/queue/";
const PLAY_ENDPOINT: string = "/play";
const ENDPOINT: string = BASE_ENDPOINT + ":queueID" + PLAY_ENDPOINT;


const getRegularToken = (userID: string): string => {
    const payload = { sub: userID, aud: ["Basic"] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });
    return token;
};

const getSpotifyToken = (userID: string): string => {
    const payload = { sub: userID, aud: ["Basic", SPOTIFY_ACCESS_LEVEL] };
    const token = jwt.sign(payload, SECRET_KEY, {
      issuer: "QShare",
      expiresIn: "60min"
    });
    return token;
};


describe("PUT " + ENDPOINT, () => {
    beforeEach(async () => {
        await initializeDB();
        await insertMockRoomChain();

        sinon.stub(ProviderSpotifyQueue.prototype, "play");
    });

    afterEach( () => {
        // Official way to restore stubs in sinon and TS...
        (ProviderSpotifyQueue.prototype.play as any).restore();
    });

    it("should return 400 if missing token", async () => {
        const response = await chai
            .request(app)
            .put(BASE_ENDPOINT + QUEUE_ID_1 + PLAY_ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .send();
        assert.equal(response.status, 400);
    });

    it("should return 400 if missing provider", async () => {
        const token = getSpotifyToken(MOCK_ID_1);

        const response = await chai
            .request(app)
            .put(BASE_ENDPOINT + QUEUE_ID_1 + PLAY_ENDPOINT)
            .set("Token", token)
            .send();
        assert.equal(response.status, 400);
    });

    it("should return 400 if queueID doesn't exists", async () => {
        const token = getSpotifyToken(MOCK_ID_1);

        const response = await chai
            .request(app)
            .put(BASE_ENDPOINT + "INVALID_QUEUE_ID" + PLAY_ENDPOINT)
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send();

        assert.equal(response.status, 400);
    });

    
    it("should not allow access without Provider Token", async () => {
        const regularToken = getRegularToken(MOCK_ID_1);
        
        const response = await chai
            .request(app)
            .put(BASE_ENDPOINT + QUEUE_ID_1 + PLAY_ENDPOINT)
            .set("Token", regularToken)
            .set("Provider", SPOTIFY_PROVIDER)
            .send();

        assert.equal(response.status, 401);
    });

    it("should not allow to play a queue that you are not the owner of", async () => {
        const token = getSpotifyToken(MOCK_ID_3);

        const response = await chai
            .request(app)
            .put(BASE_ENDPOINT + QUEUE_ID_1 + PLAY_ENDPOINT)
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send();

        assert.equal(response.status, 401);
    });

    it("should allow owner of queue to able to play the queue", async () => {
        const token = getSpotifyToken(MOCK_ID_1);

        const response = await chai
            .request(app)
            .put(BASE_ENDPOINT + QUEUE_ID_1 + PLAY_ENDPOINT)
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send();

        assert.equal(response.status, 200);
        assert.equal(response.body.status, STATUS_SUCCESS_STR);
    });

    
    it("should return 500 if unable to play queue", async () => {
        (ProviderSpotifyQueue.prototype.play as any).restore();
        sinon.stub(ProviderSpotifyQueue.prototype, "play").throws(new Error());
        
        const token = getSpotifyToken(MOCK_ID_1);

        const response = await chai
            .request(app)
            .put(BASE_ENDPOINT + QUEUE_ID_1 + PLAY_ENDPOINT)
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send();

        assert.equal(response.status, 500);
        assert.equal(response.body.status, STATUS_ERROR_STR);
    });
});
