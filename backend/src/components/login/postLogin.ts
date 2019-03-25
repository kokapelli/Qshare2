import { RequestHandler } from "express";
import { SPOTIFY_PROVIDER } from "../constants/providers";
import { MISSING_VALUES, ERROR_BODY } from "../constants/error";
import loginSpotify from "../connector/spotify/loginSpotify";
import { TokenType } from "../../type/tokenType";

const ACTION_REDIRECT = "redirect";
const ACTION_AUTHORIZE = "authorize";

const postLogin: RequestHandler = async (req, res, next) => {
    const clientToken: TokenType | undefined = res.locals.token;
    if (!clientToken) {
        return res.status(400).send(ERROR_BODY);
    }

    const provider: string | string[] | undefined = req.headers.provider;
    const action: string | string[] | undefined = req.body.action;
    
    if (!provider || !action) {
        return res.status(400).send(MISSING_VALUES);
    }

    if (!(action  === ACTION_AUTHORIZE || action === ACTION_REDIRECT)) {
        return res.status(400).send({status: "error", reason: "invalid action"});
    }

    if (action === ACTION_AUTHORIZE && req.body.credential === undefined) {
        return res.status(400).send(MISSING_VALUES);
    }

    if(provider.toString().toLowerCase() === SPOTIFY_PROVIDER) {
        return await loginSpotify(req, res, next);
    } else {
        return res.status(400).send({status: "error", reason: "invalid provider"});
    }
};

export default postLogin;
