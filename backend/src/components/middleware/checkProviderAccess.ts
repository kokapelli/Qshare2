import { RequestHandler } from "express-serve-static-core";
import { MISSING_VALUES, TOKEN_INVALID, PROVIDER_TOKEN_INVALID } from "../constants/error";
import { TokenType } from "../../type/tokenType";
import { isValidProvider } from "../connector/utils/isValidProvider";
import { validProviderAccessLevel } from "../constants/providers";

/**
 * Middleware that checks if a token has access to the provider.
 * 
 * Assumes that checkValidToken() has been called and stored token in 
 * res.locals.token
 * On success will store the lowercase provider in res.locals.provider 
 */
export const checkProviderAccess: RequestHandler = async (req, res, next) => {
    const decodedToken: TokenType | undefined = res.locals.token;
    if (!decodedToken) {
        return res.status(400).send(MISSING_VALUES);
    }

    let provider: string;
    if (!req.headers.provider) {
        return res.status(400).send(MISSING_VALUES);
    } else {
        provider = req.headers.provider.toString().toLowerCase();
    }

    if (! validProviderAccess(decodedToken, provider)) {
        return res.status(401).send(PROVIDER_TOKEN_INVALID);
    }
    res.locals.provider = provider;
    return next();
};

/**
 * Checks if a token has the provider as an access level.
 * 
 * @param decodedToken 
 * @param provider 
 */
const validProviderAccess = (decodedToken: TokenType, provider: string): boolean => {
    const validProvider = isValidProvider(provider);
    if (validProvider) {
        const accessLevels = decodedToken.aud;
        let isValid = false;
        accessLevels.forEach((level) => {
            if (validProviderAccessLevel(level, provider)) {
                isValid = true;
            }
        });
        return isValid;
    }
    return false;
};