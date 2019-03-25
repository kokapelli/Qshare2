import { RequestHandler } from "express";
import { SpotifyConnectorTokenLevel } from "./spotifyConnectorTokenLevel";
import { searchURL } from "./externalAccessPoints";
import { parseGetTracksSpotify } from "./utils/parseGetTracksSpotify";
import { SPOTIFY_MARKET } from "../../constants/spotify";

const getTracksSpotify: RequestHandler = async (req, res, next) => {
    if (!req.query.title) {
        return res.status(400);
    }

    const title: string = req.query.title;

    const spotifyConnectorTokenLevel: SpotifyConnectorTokenLevel = new SpotifyConnectorTokenLevel();

    try {
        const result = await spotifyConnectorTokenLevel.get(
            searchURL + "?q=" + title + "&type=track&market=" + SPOTIFY_MARKET
        );

        return res.status(200).send(parseGetTracksSpotify(result.data));
    } catch (e) {
        console.log("Could not fetch Spotify data");
    }
};

export default getTracksSpotify;
