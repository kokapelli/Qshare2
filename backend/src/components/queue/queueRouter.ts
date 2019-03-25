import express from "express";
import postQueueTracks from "./postQueueTracks";
import getQueue from "./getQueue";
import putPlay from "./putPlay";
import { checkProviderAccess } from "../middleware/checkProviderAccess";

const queueRouter = express.Router({mergeParams: true});

// Everything in here will be under /queue and be checked by JWT
queueRouter.get("/:queueID", getQueue);
queueRouter.post("/:queueID/tracks", postQueueTracks);


// Playback
queueRouter.put("/:queueID/play", checkProviderAccess, putPlay);


export default queueRouter;
