interface SpotifyTokenType {
    id?: string;
    access_token: string;
    scope: string;
    expiration: number;
    refresh_token: string;
    owner: string;
}

export default SpotifyTokenType;