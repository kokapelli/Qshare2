import { default as chai, assert } from "chai";
import "mocha";
import Queue from "./queue";
import QueueModel from "../../db/models/queueModel";
import { initializeDB } from "../../db/setup/dbSetup";
import User from "../../db/models/user";
import Room from "../../db/models/room";
import QueueTrackModel from "../../db/models/queueTrackModel";
import { INVALID_TRACK, VALID_TRACK } from "../../utils/test/trackExamples";


async function createDBQueue() {
    const user = await User.create({clientID: "dummy"});
    const queue = await QueueModel.create();
    await Room.create({owner: user.get("id"), queueID: queue.get("id")});
    return queue;
}

describe("Internal Queue", () => {
    describe("constructor", () => {
        it("should be initialized with an ID", () => {
            const queueID = "1";
            const queue = new Queue(queueID);
            assert.equal(queue.getID(), queueID);
        });
    });

    describe("validQueueID", () => {
        it("should be return false on invalid id", async () => {
            const queueID = "1";
            const queue = await Queue.validQueueID(queueID);
            assert.isFalse(queue);
        });
        
        it("should be return true on valid id", async () => {
            const dbQueue = await createDBQueue();
            const queueID = dbQueue.get("id");
            const queue = await Queue.validQueueID(queueID);
            assert.isTrue(queue);
        });
    });
    
    describe("addTrack", () => {
        beforeEach(async () => {
            await initializeDB();
        });

        it("should not allow invalid tracks", async () => {
            const queueID = "1";
            const queue = new Queue(queueID);

            const trackID = await queue.addTrack(INVALID_TRACK);
            assert.isNull(trackID);
        });

        it("should store valid tracks", async () => {
            const dbQueue = await createDBQueue();
            const queueID = dbQueue.get("id");
            const queue = new Queue(queueID);

            const trackID = await queue.addTrack(VALID_TRACK);
            assert.isNotNull(trackID);
        });

        it("should store the same track multiple times", async () => {
            const dbQueue = await createDBQueue();
            const queueID = dbQueue.get("id");
            const queue = new Queue(queueID);

            const trackID1 = await queue.addTrack(VALID_TRACK);
            const trackID2 = await queue.addTrack(VALID_TRACK);
            assert.isNotNull(trackID1);
            assert.isNotNull(trackID2);
            assert(trackID1 !== trackID2);
        });

        it("should store the tracks in order", async () => {
            const dbQueue = await createDBQueue();
            const queueID = dbQueue.get("id");
            const queue = new Queue(queueID);

            const trackID1 = await queue.addTrack(VALID_TRACK);
            const trackID2 = await queue.addTrack(VALID_TRACK);

            const track1 = await QueueTrackModel.findOne({where: {trackQueueID: trackID1}});
            const track2 = await QueueTrackModel.findOne({where: {trackQueueID: trackID2}});
            assert.isNotNull(track1);
            assert.isNotNull(track2);
            if (track1 && track2) {
                assert(track1.get("position") < track2.get("position"));
            }
        });
    });
    
});