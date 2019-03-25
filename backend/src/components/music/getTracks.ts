import { RequestHandler } from "express";
import { SPOTIFY_PROVIDER } from "../constants/providers";
import getTracksSpotify from "../connector/spotify/getTracksSpotify";
import { MISSING_VALUES } from "../constants/error";

const getTracks: RequestHandler = async (req, res, next) => {
    const provider: string | string[] | undefined = req.headers.provider;
    if (!provider || req.query.title === undefined) {
        return res.status(400).send(MISSING_VALUES);
    }

    if(provider.toString().toLowerCase() === SPOTIFY_PROVIDER) {
        return await getTracksSpotify(req, res, next);
    } else {
        return res.status(400).send("Couldn't match the provider");
    }
};

export default getTracks;
