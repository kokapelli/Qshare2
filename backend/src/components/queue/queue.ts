import { QShareTrack, validateQShareTrack } from "../music/musicTypes";
import QueueTrackModel from "../../db/models/queueTrackModel";
import dbConn from "../../db/setup/dbConnection";
import QueueModel from "../../db/models/queueModel";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { QueueTrackResponse } from "./types";
import { Instance } from "sequelize";
import QueueTrackType from "../../db/types/queueTrackType";
import Room from "../../db/models/room";

export default class Queue {
    private queueID: string;

    constructor(id: string) {
        this.queueID = id;
    }

    public static async validQueueID(id: string): Promise<boolean> {
        const queue = await QueueModel.findOne({where: {id}});
        return queue !== null;
    }

    public static async isOwner(userID: string, queueID: string): Promise<boolean> {
        const room = await Room.findOne({where: {
            queueID
        }});
        if (!room) { return false; }
        return room.get("owner") === userID;
    }

    public static async allowedAccess(userID: string, queueID: string): Promise<boolean> {
        const room = await Room.findOne({where: {
            queueID
        }});
        if (!room) { return false; }
        if (room.get("owner") === userID) {return true;}

        const userRoom = await AssociatedUserRoom.findOne({where: {
            roomID: room.get("id"),
            userID
        }});
        return userRoom !== null && !userRoom.get("banned");
    }

    public getID(): string {
        return this.queueID;
    }

    /**
     * Add a track to the queue.
     * @throws Sequelize errors
     * @param track The track to add to the queue
     * @param position Not yet implemented
     * @returns null if invalid track, ID of the added track otherwise
     */
    public async addTrack(track: QShareTrack, position?: number): Promise<string | null> {
        if (! validateQShareTrack(track)) {
            return null;
        }

        // A transaction is used so that two tracks won't get the same position
        const trackID = await dbConn.transaction(async t => {
            const nextPosition = await QueueTrackModel.count();
            const newTrack = await QueueTrackModel.create({
                queueID: this.queueID,
                data: JSON.stringify(track),
                position: nextPosition
            });
            return newTrack.get("trackQueueID");
        });
        return trackID;
    }

    public async getTracks(): Promise<QueueTrackResponse[]> {
        const tracks = await QueueTrackModel.findAll({
            attributes: ["trackQueueID", "position", "data"],
            where: {
                queueID: this.queueID
            },
            order: [["position", "ASC"]]
        });

        const result: QueueTrackResponse[] = [];
        tracks.forEach((t: Instance<QueueTrackType>) => {
            result.push({
                trackQueueID: t.get("trackQueueID"),
                position: t.get("position"),
                data: JSON.parse(t.get("data"))
            });
        });

        return result;
    }
}