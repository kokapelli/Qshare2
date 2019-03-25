import { RequestHandler } from "express";
import {
  ERROR_BODY,
  ERROR_ROOMID,
  ERROR_TOKEN,
  ERROR_AUTH
} from "../constants/error";
import { TokenType } from "../../type/tokenType";
import Room from "../../db/models/room";
import { SUCCESS } from "../constants/success";

const deleteRoom: RequestHandler = async (req, res, next) => {
  const token: TokenType | undefined = res.locals.token;
  const roomID = req.query.roomID;

  if (!token) {
    return res.status(400).send(ERROR_TOKEN);
  } else if (!roomID) {
    return res.status(400).send(ERROR_ROOMID);
  }

  try {
    const room = await Room.findOne({ where: { id: roomID } });

    if (room === null) {
      return res.status(400).send(ERROR_ROOMID);
    }

    if ((room.get("owner")) !== token.sub) {
      return res.status(401).send(ERROR_AUTH);
    }

    await room.update({
      isActive: false
    });

    return res.status(200).send(SUCCESS);
  } catch (e) {
    return res.status(500).send(ERROR_BODY);
  }
};

export default deleteRoom;
