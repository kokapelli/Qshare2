export interface QShareArtist {
    name: string;
    uri: string;
}
export interface QShareImage {
    width: number;
    height: number;
    url: string;
}
export interface QShareTrack {
    name: string;
    uri: string;
    artists: QShareArtist[];
    images: QShareImage[];
}

export function validateQShareTrack(track: QShareTrack): boolean {
    let valid = false;
    try {
        valid = track.name.length > 0 &&
            track.uri.length > 0 &&
            track.artists.every((artist) => {
                return artist.name.length > 0 && artist.uri.length > 0;
            }) &&
            track.images.every((image) => {
                return image.width > 0 && image.height > 0 && image.url.length > 0;
            });
    } catch(e) { // If missing any parts of a track
        return false;
    }
    return valid;
}