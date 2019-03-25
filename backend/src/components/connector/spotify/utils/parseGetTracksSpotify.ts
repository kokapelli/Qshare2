import { QShareTrack, QShareArtist } from "../../../music/musicTypes";

interface SpotifyTrack {
    name: string;
    uri: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    popularity: number;
}

interface SpotifyArtist {
    uri: string;
    name: string;
}

interface SpotifyAlbum {
    images: SpotifyAlbumImage[];
}

interface SpotifyAlbumImage {
    width: number;
    height: number;
    url: string;
}

interface SpotifyGetTracksResponse {
    tracks: {
        name: string
        items: SpotifyTrack[]
        limit: number
    };
}

export interface QShareGetTrackResponse extends QShareTrack {
    popularity: number;
}

export interface QShareGetTracksResponse {
    limit: number;
    tracks: QShareGetTrackResponse[];
}

export const parseGetTracksSpotify = (data: SpotifyGetTracksResponse) => {
    const response: QShareGetTracksResponse = {} as any;
    const tracks: QShareGetTrackResponse[] = [];

    response.tracks = tracks;
    response.limit = data.tracks.limit;
    for (const track of Array.from(data.tracks.items)) {
        const newTrack: QShareGetTrackResponse = {} as any;
        newTrack.name = track.name;

        const newArtists: QShareArtist[] = [];
        for (const artist of track.artists) {
            const newArtist: SpotifyArtist = {
                uri: artist.uri,
                name: artist.name
            };

            newArtists.push(newArtist);
        }

        newTrack.artists = newArtists;

        const newImages = [];
        for (const image of track.album.images) {
            const newImage: SpotifyAlbumImage = {
                height: image.height,
                width: image.width,
                url: image.url
            };
            newImages.push(newImage);
        }

        newTrack.images = newImages;

        newTrack.uri = track.uri;
        newTrack.popularity = track.popularity;
        tracks.push(newTrack);
    }

    return response;
};
