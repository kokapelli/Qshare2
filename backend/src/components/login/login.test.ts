import { default as chai, assert } from "chai";
import "mocha";
import app from "../../app";
import { SpotifyConnectorTokenLevel } from "../connector/spotify/spotifyConnectorTokenLevel";
import nock = require("nock");
import { initializeDB } from "../../db/setup/dbSetup";
import { SPOTIFY_PROVIDER } from "../constants/providers";

const ENDPOINT: string = "/api/login";

describe("POST " + ENDPOINT, () => {
    let token: string;
    before(async () => {
        await initializeDB();
        const result = await chai.request(app).post("/api/token").send({clientID: "test"});
        token = result.body.token;
    });

    beforeEach(() => {
        // Needed to keep connector from keeping state
        new SpotifyConnectorTokenLevel().reset();
        // Neded to remove all mocked connections
        nock.cleanAll();
        if (nock.isActive()) {
            nock.restore();
        }
    });

    afterEach(() => {
        // Needed to keep connector from keeping state
        new SpotifyConnectorTokenLevel().reset();
        // Neded to remove all mocked connections
        nock.cleanAll();
        if (nock.isActive()) {
            nock.restore();
        }
    });

    it("should return 400 if missing Provider in header", async () => {
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Token", token)
            .send({action: "redirect"});
        assert.equal(response.status, 400);
        assert.equal(response.body.status, "error");
    });

    it("should return 400 if invalid Provider in header", async () => {
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", "randomNameHere")
            .set("Token", token)
            .send({action: "redirect"});
        assert.equal(response.status, 400);
        assert.equal(response.body.status, "error");
        assert.equal(response.body.reason, "invalid provider");
    });

    it("should return 400 if missing action in body", async () => {
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .set("Token", token)
            .send();
        assert.equal(response.status, 400);
        assert.equal(response.body.status, "error");
    });

    it("should return 400 if invalid action in body", async () => {
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .set("Token", token)
            .send({action: "randomAction"});
        assert.equal(response.status, 400);
        assert.equal(response.body.status, "error");
        assert.equal(response.body.reason, "invalid action");
    });

    it("should return 400 if missing credential on authorize action", async () => {
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .set("Token", token)
            .send({action: "authorize"});
        assert.equal(response.status, 400);
        assert.equal(response.body.status, "error");
    });

    it("should return 200 and redirect if no credential and not logged in", async () => {
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .set("Token", token)
            .send({action: "redirect"});
        assert.equal(response.status, 200);
        assert.equal(response.body.status, "redirect");
        assert(response.body.url !== undefined);
    });

    it("should return failure when unable to log in with credential", async () => {
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .set("Token", token)
            .send({credential: "asd", action: "authorize"});

        assert.equal(response.status, 402);
        assert.equal(response.body.status, "error");
        assert.equal(response.body.reason, "rejected by provider");
    });

    it("should return success when able to log in with credential", async () => {
        nock.activate();
        nock("https://accounts.spotify.com")
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "b", expires_in: 3600});

        nock("https://accounts.spotify.com")
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "b", token_type: "Bearer",
                scope: "", expires_in: 3600, refresh_token: "asd"});
        nock("https://api.spotify.com")
            .get("/v1/me")
            .reply(200, {
                uri:
                    "spotify:user:spotifymockid"
            });
            
        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .set("Token", token)
            .send({credential: "asd", action: "authorize"});

        assert.equal(response.status, 200);
        assert.equal(response.body.status, "success");
    });

    it("should use authorization when requesting login token", async () => {
        nock.activate();
        nock("https://accounts.spotify.com")
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "b", expires_in: 3600});
        nock("https://accounts.spotify.com")
            .matchHeader("Authorization", val => {
                return val.includes("Basic");
            })
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "b", token_type: "Bearer",
                scope: "", expires_in: 3600, refresh_token: "asd"});

        nock("https://accounts.spotify.com")
            .matchHeader("Authorization", val => {
                return val.includes("Bearer");
            })
            .post("/api/token")
            .query(true)
            .reply(400);

        nock("https://api.spotify.com")
        .get("/v1/me")
        .reply(200, {
            uri:
                "spotify:user:spotifymockid"
        });

        const response = await chai
            .request(app)
            .post(ENDPOINT)
            .set("Provider", SPOTIFY_PROVIDER)
            .set("Token", token)
            .send({credential: "asd", action: "authorize"});

        assert.equal(response.status, 200);
        assert.equal(response.body.status, "success");
    });
});
