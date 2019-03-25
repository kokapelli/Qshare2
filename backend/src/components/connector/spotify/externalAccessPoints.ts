const baseURL: string = "https://api.spotify.com/v1";

const searchURL:string = baseURL + "/search";

const authorizeURL: string = "https://accounts.spotify.com/authorize";

const tokenURL: string = "https://accounts.spotify.com/api/token";

const userProfileURL: string = baseURL + "/me";

const playURL: string = userProfileURL + "/player/play";

const getPlaylistsURL = (user: string) => {
    return "https://api.spotify.com/v1/users/" + user + "/playlists";
};

const getPlaylistTrackURL = (playlistID: string) => {
    return "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks";
};

export { 
    searchURL, authorizeURL, tokenURL, userProfileURL, getPlaylistsURL, getPlaylistTrackURL,
    playURL
};