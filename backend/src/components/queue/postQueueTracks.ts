import { RequestHandler } from "express-serve-static-core";
import { TokenType } from "../../type/tokenType";
import { ERROR_TOKEN, ERROR_QUEUEID, ERROR_AUTH, MISSING_VALUES, ERROR_BODY, ERROR_TRACK } from "../constants/error";
import Queue from "./queue";
import { QShareTrack } from "../music/musicTypes";
import { SUCCESS } from "../constants/success";
import { ProviderQueue, providerQueueMaker } from "./providerQueue";


const postQueueTracks: RequestHandler = async (req, res, next) => {
    const token: TokenType | undefined = res.locals.token;
    const queueID: string | undefined = req.params.queueID;
    let provider: string;
  
    if (!req.headers.provider) {
      return res.status(400).send(MISSING_VALUES);
    } else {
      provider = req.headers.provider.toString().toLowerCase();
    }

    if (!token) {
        return res.status(400).send(ERROR_TOKEN);
    } else if (!queueID || ! await Queue.validQueueID(queueID)) {
        return res.status(400).send(ERROR_QUEUEID);
    } else if (! await Queue.allowedAccess(token.sub, queueID)) {
        return res.status(401).send(ERROR_AUTH);
    }

    const track: QShareTrack | undefined = req.body.track;
    if (!track) {
        return res.status(400).send(MISSING_VALUES);
    }

    try {
        const queue = new Queue(queueID);
        const trackID = await queue.addTrack(track);

        const providerQueue: ProviderQueue = providerQueueMaker(provider, queueID);
        await providerQueue.addTrack(track);

        if (trackID) {
            return res.status(200).send(SUCCESS);
        } else {
            return res.status(400).send(ERROR_TRACK);
        }
    } catch (e) {
        return res.status(500).send(ERROR_BODY);
    }
};

export default postQueueTracks;