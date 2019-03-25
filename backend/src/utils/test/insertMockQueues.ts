import QueueModel from "../../db/models/queueModel";
import ProviderSpotifyQueueModel from "../../db/models/Provider/Spotify/providerSpotifyQueueModel";


const QUEUE_ID_1: string = "76f3c205-b9ac-4017-98ce-4aa99893622c";
const SPOTIFY_QUEUE_ID_1: string = "5f36408b-5e3c-43b9-b606-fbfc1ab823b9";
const QUEUE_ID_2: string = "fb14de2e-4216-4c98-9697-12e409fd2385";
const QUEUE_ID_3: string = "97d4aaf0-dc54-42ac-93de-f0650eeb6992";
const QUEUE_ID_4: string = "f9028ceb-9a4f-46fa-9919-655fe13cd7f8";

const insertMockQueues = async () => {
    const queue1 = await QueueModel.create({
        id: QUEUE_ID_1
    });
    const queue2 = await QueueModel.create({
        id: QUEUE_ID_2
    });
    const queue3 = await QueueModel.create({
        id: QUEUE_ID_3
    });

};

export { insertMockQueues, QUEUE_ID_1, QUEUE_ID_2, QUEUE_ID_3, SPOTIFY_QUEUE_ID_1, QUEUE_ID_4 };
