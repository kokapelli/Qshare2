import { RequestHandler } from "express";
import { MISSING_VALUES, TOKEN_INVALID } from "../constants/error";
import jwt from "jsonwebtoken";
import SECRET_KEY from "../../utils/secretKey";

const checkValidToken: RequestHandler = async (req, res, next) => {
  const token: string | undefined = req.headers.token as string | undefined;
  if (!token) {
    return res.status(400).send(MISSING_VALUES);
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    res.locals.token = decodedToken;
    return next();
  } catch (e) {
    return res.status(401).send(TOKEN_INVALID);
  }
};

export default checkValidToken;
