import { RequestHandler } from "express";
import { ERROR_BODY } from "../constants/error";
import { TokenType } from "../../type/tokenType";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { STATUS_SUCCESS_STR } from "../constants/success";

const getRoom: RequestHandler = async (req, res, next) => {
  const token: TokenType | undefined = res.locals.token;
  if (!token) {
    return res.status(400).send(ERROR_BODY);
  }

  try {
    const roomsResult = await AssociatedUserRoom.findAll({
      where: {
        userID: token.sub
      }
    });

    const rooms: Array<{id: string}> = [];

    roomsResult.forEach(e => {
      const roomID: string = e.get("roomID");
      const banned: boolean = e.get("banned");

      if (!banned) {
        rooms.push({id: roomID});
      }
    });

    return res.status(200).send({
      status: STATUS_SUCCESS_STR,
      rooms
    });
  } catch (e) {
    return res.status(500).send(ERROR_BODY);
  }
};

export default getRoom;
