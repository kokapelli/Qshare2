import { RequestHandler } from "express-serve-static-core";
import { TokenType } from "../../type/tokenType";
import { ERROR_TOKEN, ERROR_QUEUEID, ERROR_AUTH, ERROR_BODY, MISSING_VALUES } from "../constants/error";
import Queue from "./queue";
import { SUCCESS } from "../constants/success";
import { ProviderQueue, providerQueueMaker } from "./providerQueue";


const putPlay: RequestHandler = async (req, res, next) => {
    const token: TokenType | undefined = res.locals.token;
    const queueID: string | undefined = req.params.queueID;
    if (!token) {
        return res.status(400).send(ERROR_TOKEN);
    } else if (!queueID || ! await Queue.validQueueID(queueID)) {
        return res.status(400).send(ERROR_QUEUEID);
    } else if (!await Queue.isOwner(token.sub, queueID)) {
        return res.status(401).send(ERROR_AUTH);
    }

    const provider: string | undefined = res.locals.provider;
    if (!provider) {
        return res.status(400).send(MISSING_VALUES);
    }

    try {
        const providerQueue: ProviderQueue = providerQueueMaker(provider, queueID);
        await providerQueue.play();
        return res.status(200).send(SUCCESS);
    } catch (e) {
        return res.status(500).send(ERROR_BODY);
    }
};

export default putPlay;