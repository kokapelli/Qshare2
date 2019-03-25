import { RequestHandler } from "express";
import { authorizeURL, tokenURL, userProfileURL } from "./externalAccessPoints";
import { SpotifyConnectorTokenLevel } from "./spotifyConnectorTokenLevel";
import { CLIENT_ID, REDIRECT_URI } from "../../constants/spotify";
import { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
import User from "../../../db/models/user";
import { Instance } from "sequelize";
import UserType from "../../../db/types/userType";
import { Token } from "../token";
import SECRET_KEY from "../../../utils/secretKey";
import { TokenType } from "../../../type/tokenType";
import { ERROR_BODY, STATUS_ERROR_STR } from "../../constants/error";
import { SpotifyConnectorUserLevel } from "./spotifyConnectorUserLevel";
import { STATUS_SUCCESS_STR } from "../../constants/success";
import ProviderSpotifyUserModel from "../../../db/models/Provider/Spotify/providerSpotifyUserModel";
import SpotifyToken from "../../../db/models/Provider/Spotify/spotifyToken";
import { SPOTIFY_ACCESS_LEVEL } from "../../constants/providers";

const SCOPES = "playlist-modify-private playlist-read-private user-modify-playback-state";

interface SpotifyAccesTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

async function storeToken(user: Instance<UserType>, token: SpotifyAccesTokenResponse) {
    await SpotifyToken.upsert({
        access_token: token.access_token,
        scope: token.scope,
        expiration: Token.getExpirationDate(token.expires_in).getDate(),
        refresh_token: token.refresh_token,
        owner: user.get("id")
    });
}

const loginSpotify: RequestHandler = async (req, res, next) => {
    const clientToken: TokenType | undefined = res.locals.token;
    if (!clientToken) {
        return res.status(400).send(ERROR_BODY);
    }

    const user: Instance<UserType> | null = await User.findOne({where: {id: clientToken.sub}});
    if (user === null) { // Should not be able to happen given a valid token
        return res.status(402).send({status: STATUS_ERROR_STR, reason: "invalid user ID"});
    }

    if (req.body.action === "redirect") {
        const redirectURL: string = authorizeURL + "?client_id=" + CLIENT_ID + 
            "&response_type=code&redirect_uri=" + REDIRECT_URI + "&scope=" +
            encodeURIComponent(SCOPES);
        return res.status(200).send({status: "redirect", url: redirectURL});
    }

    const credential: string = req.body.credential;
    const spotifyConnector: SpotifyConnectorTokenLevel = new SpotifyConnectorTokenLevel();

    try {
        const results: AxiosResponse<SpotifyAccesTokenResponse> = await spotifyConnector.postAuth(tokenURL + "?grant_type=authorization_code&code=" +
            credential + "&redirect_uri=" + REDIRECT_URI);
        await storeToken(user, results.data);
        const payload = {
            sub: user.get("id"),
            aud: ["Basic", SPOTIFY_ACCESS_LEVEL]
        };
        
        const token = jwt.sign(payload, SECRET_KEY, {
            issuer: "QShare",
            expiresIn: "60min"
        });

        ProviderSpotifyUserModel.findOrCreate({
            where: {
                userID: user.get("id"),
                spotifyUserID: await getSpotifyUserID(payload.sub)
            }
        });

        return res.status(200).send({status: STATUS_SUCCESS_STR, token});
    } catch (e) {
        if (e.response.status === 400) {
            return res.status(402).send({status: STATUS_ERROR_STR, reason: "rejected by provider"});
        }
        console.log("Unexpected error response code");
        return res.status(500);
    }
};

const getSpotifyUserID = async (token: string) => {
    const userLevel = new SpotifyConnectorUserLevel(token);
    const userProfile = await userLevel.get(userProfileURL);
    return userProfile.data.uri.substr(13);
};

export default loginSpotify;