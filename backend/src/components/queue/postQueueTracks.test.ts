import { default as chai, assert } from "chai";
import "mocha";
import sinon from "sinon";

import app from "../../app";
import { initializeDB } from "../../db/setup/dbSetup";

import { STATUS_SUCCESS_STR } from "../constants/success";
import { STATUS_ERROR_STR } from "../constants/error";
import { MOCK_CLIENTID_1, MOCK_CLIENTID_2, MOCK_CLIENTID_3, MOCK_ID_2, MOCK_ID_1 } from "../../utils/test/insertMockUsers";
import { ROOM_ID_1 } from "../../utils/test/insertMockRooms";
import { QUEUE_ID_1, QUEUE_ID_3 } from "../../utils/test/insertMockQueues";
import { VALID_TRACK, INVALID_TRACK} from "../../utils/test/trackExamples";
import QueueTrackModel from "../../db/models/queueTrackModel";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";
import { ProviderSpotifyQueue } from "../connector/spotify/providerSpotifyQueue";
import { SPOTIFY_PROVIDER } from "../constants/providers";

const ENDPOINT: string = "/api/queue/:queueID/tracks";
const BASE_ENDPOINT: string = "/api/queue/";


describe("POST " + ENDPOINT, () => {
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
        const response = await chai
            .request(app)
            .post(BASE_ENDPOINT + QUEUE_ID_1 + "/tracks")
            .set("Provider", SPOTIFY_PROVIDER)
            .send({track: VALID_TRACK});
        assert.equal(response.status, 400);
    });

    it("should return 400 if missing provider", async () => {
        const token = (await chai
            .request(app)
            .post("/api/token")
            .send({ clientID: MOCK_CLIENTID_1 })).body.token;

        const response = await chai
            .request(app)
            .post(BASE_ENDPOINT + QUEUE_ID_1 + "/tracks")
            .set("Token", token)
            .send({track: VALID_TRACK});
        assert.equal(response.status, 400);
    });

    it("should return 400 if queueID doesn't exists", async () => {
        const token = (await chai
            .request(app)
            .post("/api/token")
            .send({ clientID: MOCK_CLIENTID_1 })).body.token;

        const response = await chai
            .request(app)
            .post(BASE_ENDPOINT + "/INVALID_ID/tracks")
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send({track: VALID_TRACK});

        assert.equal(response.status, 400);
        assert.equal(response.body.status, STATUS_ERROR_STR);
    });


    it("should not allow to add track to a queue that you are not a part of", async () => {
        const token = (await chai
            .request(app)
            .post("/api/token")
            .send({ clientID: MOCK_CLIENTID_3 })).body.token;

        const response = await chai
            .request(app)
            .post(BASE_ENDPOINT + QUEUE_ID_3 + "/tracks")
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send({track: VALID_TRACK});

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
            .post(BASE_ENDPOINT + QUEUE_ID_1 + "/tracks")
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send({track: VALID_TRACK});

        assert.equal(response.status, 401);
        assert.equal(response.body.status, STATUS_ERROR_STR);
    });

    it("should not add invalid tracks", async () => {
        const token = (await chai
            .request(app)
            .post("/api/token")
            .send({ clientID: MOCK_CLIENTID_1 })).body.token;

        const response = await chai
            .request(app)
            .post(BASE_ENDPOINT + QUEUE_ID_1 + "/tracks")
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send({track: INVALID_TRACK});

        assert.equal(response.status, 400);
        assert.equal(response.body.status, STATUS_ERROR_STR);

        const dbTrack = await QueueTrackModel.findAll({
            where: {
                queueID: QUEUE_ID_1
            }
        });

        assert.isEmpty(dbTrack);
    });

    it("should allow member of queue to able to add a track", async () => {
        const token = (await chai
            .request(app)
            .post("/api/token")
            .send({ clientID: MOCK_CLIENTID_1 })).body.token;

        const response = await chai
            .request(app)
            .post(BASE_ENDPOINT + QUEUE_ID_1 + "/tracks")
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send({track: VALID_TRACK});

        assert.equal(response.status, 200);
        assert.equal(response.body.status, STATUS_SUCCESS_STR);

        const dbTrack = await QueueTrackModel.findAll({
            where: {
                queueID: QUEUE_ID_1
            }
        });

        assert.isNotEmpty(dbTrack);
        assert.equal(dbTrack[0].get("queueID"), QUEUE_ID_1);
    });

    it("should return 500 if internal provider queue fails", async () => {
        (ProviderSpotifyQueue.prototype.addTrack as any).restore();
        sinon.stub(ProviderSpotifyQueue.prototype, "addTrack").throws(new Error());

        const token = (await chai
            .request(app)
            .post("/api/token")
            .send({ clientID: MOCK_CLIENTID_1 })).body.token;

        const response = await chai
            .request(app)
            .post(BASE_ENDPOINT + QUEUE_ID_1 + "/tracks")
            .set("Token", token)
            .set("Provider", SPOTIFY_PROVIDER)
            .send({track: VALID_TRACK});

        assert.equal(response.status, 500);
        assert.equal(response.body.status, STATUS_ERROR_STR);
    });


    
});
