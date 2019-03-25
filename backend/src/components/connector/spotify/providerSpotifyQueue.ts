import { ProviderQueue } from "../../queue/providerQueue";
import { QShareTrack } from "../../music/musicTypes";
import ProviderSpotifyQueueModel from "../../../db/models/Provider/Spotify/providerSpotifyQueueModel";
import { Instance } from "sequelize";
import ProviderSpotifyUserType from "../../../db/types/Provider/Spotify/providerSpotifyUserType";
import ProviderSpotifyUserModel from "../../../db/models/Provider/Spotify/providerSpotifyUserModel";
import { SpotifyConnectorUserLevel } from "./spotifyConnectorUserLevel";
import { getPlaylistsURL, getPlaylistTrackURL, playURL } from "./externalAccessPoints";
import { PLAYLIST_CREATE_PAYLOAD } from "../../constants/spotify";
import Room from "../../../db/models/room";

export class ProviderSpotifyQueue implements ProviderQueue {
    private queueID: string;
    
    constructor(queueID: string) {
        this.queueID = queueID;
    }
    
    public async create(owner: string) {
        const existingQueue: boolean = await this.queueExist();
        if (existingQueue) {
            return;
        }
        
        const spotifyUserID: string = await this.getSpotifyUserID(owner);
        
        const spotifyConnectorUserLevel = new SpotifyConnectorUserLevel(owner);
        const createdSpotifyPlaylist = await spotifyConnectorUserLevel.post(
            getPlaylistsURL(spotifyUserID),
            PLAYLIST_CREATE_PAYLOAD
        );
            
        const playlistID = createdSpotifyPlaylist.data.id;
        if (!playlistID) {
            throw Error("Response data from Spotify is missing playlist id");
        }
        
        await ProviderSpotifyQueueModel.create({
            queueID: this.queueID,
            playlistID
        });
    }
    
    public async addTrack(track: QShareTrack) {
        const playlistID: string = await this.getPlaylistID();
        const owner: string = await this.getQueueOwner();
    
        const connector = new SpotifyConnectorUserLevel(owner);
        await connector.post(
            getPlaylistTrackURL(playlistID),
            {
                uris: [track.uri]
            }
        );
    }

    public async play(): Promise<void> {
        const playlistID: string = await this.getPlaylistID();
        const owner: string = await this.getQueueOwner();

        const connector = new SpotifyConnectorUserLevel(owner);
        await connector.put(playURL,
            {
                context_uri: "spotify:playlist:" + playlistID
            }
        );
    }

    private async getSpotifyUserID(owner: string) {
        const spotifyUserInstance: Instance<ProviderSpotifyUserType> | null = await ProviderSpotifyUserModel.findOne({ where: { userID: owner } });
        if (!spotifyUserInstance) {
            throw Error("Couldn't find Spotify user database instance");
        }
        return spotifyUserInstance.get("spotifyUserID");
    }

    private async queueExist(): Promise<boolean> {
        const queue = await ProviderSpotifyQueueModel.findOne({ where: { queueID: this.queueID } });
        return queue !== null;
    }
    
    private async getQueueOwner(): Promise<string> {
        const room = await Room.findOne({ where: { queueID: this.queueID } });
        if (!room) {
            throw new Error("queue is not associated to a room");
        }
        return room.get("owner");
    }

    private async getPlaylistID(): Promise<string> {
        const providerSpotifyQueueModel = await ProviderSpotifyQueueModel.findOne({
            where: { queueID: this.queueID }
        });
        if (!providerSpotifyQueueModel) {
            throw new Error("queueID doesn't exist");
        }
        return providerSpotifyQueueModel.get("playlistID");
    }
}
