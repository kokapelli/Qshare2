import { QShareTrack } from "../music/musicTypes";


export interface QueueTrackResponse {
    trackQueueID: string;
    position: number;
    data: QShareTrack;
}
