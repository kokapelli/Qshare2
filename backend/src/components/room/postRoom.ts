import { RequestHandler } from "express";
import { ERROR_BODY, MISSING_VALUES, ERROR_MISSING_SPOTIFY_TOKEN } from "../constants/error";
import { TokenType } from "../../type/tokenType";
import Room from "../../db/models/room";
import { STATUS_SUCCESS_STR } from "../constants/success";
import QueueModel from "../../db/models/queueModel";
import { isValidProvider } from "../connector/utils/isValidProvider";
import { providerQueueMaker, ProviderQueue } from "../queue/providerQueue";
import { SPOTIFY_ACCESS_LEVEL } from "../constants/providers";

const postRoom: RequestHandler = async (req, res, next) => {
  const token: TokenType | undefined = res.locals.token;
  let provider: string;

  if (!req.headers.provider) {
    return res.status(400).send(MISSING_VALUES);
  } else {
    provider = req.headers.provider.toString().toLowerCase();
  }

  if (!isValidProvider(provider)) {
    return res.status(400).send(ERROR_BODY);
  }

  if (!token) {
    return res.status(400).send(ERROR_BODY);
  } else if (!token.aud.includes(SPOTIFY_ACCESS_LEVEL)) {
    return res.status(400).send(ERROR_MISSING_SPOTIFY_TOKEN);
  }

  try {
    const newQueue = await QueueModel.create();

    const newRoom = await Room.create({
      owner: token.sub,
      queueID: newQueue.get("id")
    });

    const providerQueue: ProviderQueue = providerQueueMaker(provider, newQueue.get("id"));
    await providerQueue.create(token.sub);

    return res.status(200).send({
      status: STATUS_SUCCESS_STR,
      roomID: newRoom.get("id"),
      queueID: newQueue.get("id")
    });
  } catch (e) {
    return res.status(500).send(ERROR_BODY);
  }
};

export default postRoom;
