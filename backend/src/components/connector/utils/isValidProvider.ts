import { SPOTIFY_PROVIDER } from "../../constants/providers";

const isValidProvider = (provider: string) => {
    return provider === SPOTIFY_PROVIDER;
};

export { isValidProvider };