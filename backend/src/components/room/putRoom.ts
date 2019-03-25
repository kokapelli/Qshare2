import { RequestHandler } from "express";
import {
  ERROR_BODY,
  ERROR_TOKEN,
  MISSING_VALUES,
  ERROR_BAN,
  ERROR_AUTH,
  ERROR_ROOMID,
  ERROR_ACTION,
  ERROR_USERID
} from "../constants/error";
import { TokenType } from "../../type/tokenType";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { SUCCESS,STATUS_SUCCESS_STR } from "../constants/success";
import Room from "../../db/models/room";
import Sequelize from "sequelize";

enum Action {
  BAN = 99, // Got TypeScript error if we started to count enums from 0 (default behavior)
  UNBAN,
  JOIN,
  KICK
}

interface PutRoomRawType {
  roomID: string;
  action: string;
  userID?: string;
}

const putRoom: RequestHandler = async (req, res, next) => {
  const token: TokenType = res.locals.token;
  const options: PutRoomRawType = req.body;

  const missingParamMessage = isMissingParamaters(token, options);
  if (missingParamMessage) {
    return res.status(400).send(missingParamMessage);
  }

  const action: Action | undefined = identifyAction(options.action);
  if (!action) {
    return res.status(400).send(ERROR_BODY);
  }

  if (action === Action.JOIN) {
    return joinRoom(req, res, next);
  }

  if (action === Action.BAN) {
    return banUser(req, res, next);
  }

  if (action === Action.UNBAN) {
    return unbanUser(req, res, next);
  }
};

const banUser: RequestHandler = async (req, res, next) => {
  const token: TokenType = res.locals.token;
  const options: PutRoomRawType = req.body;

  if (!options.userID) {
    return res.status(400).send(MISSING_VALUES);
  }

  if (!(await isOwner(token, options.roomID))) {
    return res.status(401).send(ERROR_AUTH);
  }

  try {
    const result = await AssociatedUserRoom.update(
      {
        banned: true
      },
      {
        where: {
          userID: options.userID,
          roomID: options.roomID
        }
      }
    );
    if (result[0]) {
      return res.status(200).send(SUCCESS);
    } else {
      return res.status(400).send(ERROR_BODY);
    }
  } catch (e) {
    return res.status(400).send(ERROR_BODY);
  }
};

const unbanUser: RequestHandler = async (req, res, next) => {
  const token: TokenType = res.locals.token;
  const options: PutRoomRawType = req.body;

  if (!options.userID) {
    return res.status(400).send(MISSING_VALUES);
  }

  if (!(await isOwner(token, options.roomID))) {
    return res.status(401).send(ERROR_AUTH);
  }

  try {
    const result = await AssociatedUserRoom.update(
      {
        banned: false
      },
      {
        where: {
          userID: options.userID,
          roomID: options.roomID
        }
      }
    );
    if (result[0]) {
      return res.status(200).send(SUCCESS);
    } else {
      return res.status(400).send(ERROR_BODY);
    }
  } catch (e) {
    return res.status(400).send(ERROR_BODY);
  }
};

const joinRoom: RequestHandler = async (req, res, next) => {
  const token: TokenType = res.locals.token;
  const options: PutRoomRawType = req.body;
  try {
    const room = await Room.findOne({
        where: { id: options.roomID }
    });

    if (!room) {
      return res.status(400).send(ERROR_ROOMID);
    }

    const roomAssociation = await AssociatedUserRoom.findOrCreate({
      where: {
        roomID: options.roomID,
        userID: token.sub
      }
    });

    const banned: boolean = roomAssociation[0].get("banned");
    if (banned) {
      return res.status(401).send(ERROR_BAN);
    }

    return res.status(200).send({
        status: STATUS_SUCCESS_STR,
        queueID: room.get("queueID")
    });

  } catch (e) {
    if (e instanceof Sequelize.ForeignKeyConstraintError) {
      e = e as Sequelize.ForeignKeyConstraintError;
      if (e.message.includes("roomID")) {
        return res.status(400).send(ERROR_ROOMID);
      } else if (e.message.includes("userID")) {
        return res.status(400).send(ERROR_USERID);
      }
    }
    return res.status(400).send(ERROR_BODY);
  }
};

const isOwner = async (token: TokenType, roomID: string) => {
  const room = await Room.findOne({
    where: { id: roomID }
  });

  if (!room) {
    return false;
  }

  const roomOwner = room.get("owner");

  return roomOwner === token.sub;
};

const isMissingParamaters = (
  token: TokenType | undefined,
  options: PutRoomRawType
) => {
  if (!token) {
    return ERROR_TOKEN;
  } else if (!options.action && !options.roomID) {
    return MISSING_VALUES;
  } else if (!options.roomID) {
    return ERROR_ROOMID;
  } else if (!options.action) {
    return ERROR_ACTION;
  }

  return undefined;
};

const identifyAction = (actionRaw: string) => {
  if (actionRaw.toLowerCase() === "join") {
    return Action.JOIN;
  } else if (actionRaw.toLowerCase() === "kick") {
    return Action.KICK;
  } else if (actionRaw.toLowerCase() === "ban") {
    return Action.BAN;
  } else if (actionRaw.toLowerCase() === "unban") {
    return Action.UNBAN;
  }

  return undefined;
};

export default putRoom;
