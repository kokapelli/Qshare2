import express from "express";
import postRoom from "./postRoom";
import deleteRoom from "./deleteRoom";
import putRoom from "./putRoom";
import getRoom from "./getRoom";

const roomRouter = express.Router({mergeParams: true});

roomRouter.post("", postRoom);
roomRouter.delete("", deleteRoom);
roomRouter.put("", putRoom);
roomRouter.get("", getRoom);


export default roomRouter;
