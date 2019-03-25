export const SPOTIFY_PROVIDER: string = "spotify";
export const SPOTIFY_ACCESS_LEVEL: string = "Spotify";

const providerAccessLevels = {};
providerAccessLevels[SPOTIFY_PROVIDER] = SPOTIFY_ACCESS_LEVEL;

export const validProviderAccessLevel = (accessLevel: string, provider: string): boolean => {
    return providerAccessLevels[provider] === accessLevel;
};