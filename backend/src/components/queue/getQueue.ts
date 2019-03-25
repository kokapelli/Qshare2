import { RequestHandler } from "express-serve-static-core";
import { TokenType } from "../../type/tokenType";
import { ERROR_TOKEN, ERROR_QUEUEID, ERROR_AUTH, ERROR_BODY } from "../constants/error";
import Queue from "./queue";
import { STATUS_SUCCESS_STR } from "../constants/success";


const getQueue: RequestHandler = async (req, res, next) => {
    const token: TokenType | undefined = res.locals.token;
    const queueID: string | undefined = req.params.queueID;
    
    if (!token) {
        return res.status(400).send(ERROR_TOKEN);
    } else if (!queueID || ! await Queue.validQueueID(queueID)) {
        return res.status(400).send(ERROR_QUEUEID);
    } else if (! await Queue.allowedAccess(token.sub, queueID)) {
        return res.status(401).send(ERROR_AUTH);
    }

    try {
        const queue = new Queue(queueID);
        const tracks = await queue.getTracks();
        return res.status(200).send({
            status: STATUS_SUCCESS_STR,
            tracks 
        });
    } catch (e) {
        return res.status(500).send(ERROR_BODY);
    }
};

export default getQueue;