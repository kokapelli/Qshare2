import { QShareTrack } from "../../components/music/musicTypes";


const VALID_TRACK: QShareTrack = {
    "name": "Ryu - Original Mix",
    "artists": [
        {
            "uri": "spotify:artist:1vCWHaC5f2uS3yhpwWbIA6",
            "name": "Avicii"
        }
    ],
    "images": [
        {
            "height": 640,
            "width": 640,
            "url": "https://i.scdn.co/image/c481b608bca41df6dedf7a644619d326b3df2626"
        },
        {
            "height": 300,
            "width": 300,
            "url": "https://i.scdn.co/image/9314bd270447405df21b54a605e8c3fcf8feca02"
        },
        {
            "height": 64,
            "width": 64,
            "url": "https://i.scdn.co/image/1f7b9d41a985983501bcdef3fd1505268210f3d9"
        }
    ],
    "uri": "spotify:track:6Ol2HirpV5wdzCggAUNM9q"
};

const INVALID_TRACK: QShareTrack = {
    "name": "Ryu - Original Mix",
    "artists": [
        {
            "uri": "spotify:artist:1vCWHaC5f2uS3yhpwWbIA6",
            "name": "Avicii"
        }
    ],
    "images": [
        {
            "height": 640,
            "width": 640,
            "url": "https://i.scdn.co/image/c481b608bca41df6dedf7a644619d326b3df2626"
        },
        {
            "height": 300,
            "width": 300,
            "url": "https://i.scdn.co/image/9314bd270447405df21b54a605e8c3fcf8feca02"
        },
        {
            "height": 64,
            "width": 64,
            "url": "https://i.scdn.co/image/1f7b9d41a985983501bcdef3fd1505268210f3d9"
        }
    ],
    // Missing URI
} as any; // To make TS like it

function clone(track: QShareTrack) {
    return JSON.parse(JSON.stringify(track));
}

export {clone, VALID_TRACK, INVALID_TRACK};