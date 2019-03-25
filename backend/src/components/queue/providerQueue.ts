import { SPOTIFY_PROVIDER } from "../constants/providers";
import { QShareTrack } from "../music/musicTypes";
import { ProviderSpotifyQueue } from "../connector/spotify/providerSpotifyQueue";

export interface ProviderQueue {
    create(owner: string): Promise<void>;
    addTrack(track: QShareTrack): Promise<void>;
    play(): Promise<void>;
}

/**
 * Creates an instance of a provider queue with a given provider
 * @param provider The provider to construct a queue for
 * @param queueID The ID of the corresponding internal queue
 * @throws Error on invalid provider
 */
export const providerQueueMaker = (provider: string, queueID: string): ProviderQueue => {
    switch(provider) {
        case SPOTIFY_PROVIDER:
            return new ProviderSpotifyQueue(queueID);
        default:
            throw new Error("Invalid provider");
    }
};