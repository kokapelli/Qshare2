import { assert } from "chai";
import nock from "nock";

import "mocha";
import { SpotifyConnectorTokenLevel } from "./spotifyConnectorTokenLevel";
import moveTimeForwardSeconds from "../../testUtils/timeControl";


describe("spotifyConnectorTokenLevel", () => {
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

    it("should be able to query Spotify WebAPI", async () => {
        const spotifyConnector: SpotifyConnectorTokenLevel = new SpotifyConnectorTokenLevel();

        const response = await spotifyConnector.get(
            "https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6"
        );

        assert.equal(response.status, 200);
    });

    it("should only be allowed one instance (singleton)", () => {
        const firstConnector: SpotifyConnectorTokenLevel = new SpotifyConnectorTokenLevel();
        const secondConnector: SpotifyConnectorTokenLevel = new SpotifyConnectorTokenLevel();

        assert(firstConnector === secondConnector);
    });

    it("should refresh client access token on expiration", async () => {
        nock.activate();

        const firstTokenCall = nock("https://accounts.spotify.com")
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "a", expires_in: 1});
        const secondTokenCall = nock("https://accounts.spotify.com")
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "b", expires_in: 3600});
        
        nock("https://api.spotify.com")
            .persist()
            .get("/v1/artists/1vCWHaC5f2uS3yhpwWbIA6")
            .reply(200, {data: "Dummy data"});
    
        const connector: SpotifyConnectorTokenLevel = new SpotifyConnectorTokenLevel();
        const response1 = await connector.get("https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6");
        moveTimeForwardSeconds(10);
        const response2 = await connector.get("https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6");

        assert(firstTokenCall.isDone() && secondTokenCall.isDone());
    });

    it("should not refresh client access token when still valid", async () => {
        nock.activate();
        
        const firstTokenCall = nock("https://accounts.spotify.com")
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "a", expires_in: 3600});
        const secondTokenCall = nock("https://accounts.spotify.com")
            .post("/api/token")
            .query(true)
            .reply(200, {access_token: "b", expires_in: 3600});
        
        nock("https://api.spotify.com")
            .persist()
            .get("/v1/artists/1vCWHaC5f2uS3yhpwWbIA6")
            .reply(200, {data: "Dummy data"});
    
        const connector: SpotifyConnectorTokenLevel = new SpotifyConnectorTokenLevel();
        const response1 = await connector.get("https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6");
        moveTimeForwardSeconds(10);
        const response2 = await connector.get("https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6");

        assert(firstTokenCall.isDone() && !secondTokenCall.isDone());
    });
});
