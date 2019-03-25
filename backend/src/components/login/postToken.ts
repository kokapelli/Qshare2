import { RequestHandler } from "express";
import User from "../../db/models/user";
import UserType from "../../db/types/userType";
import { Instance } from "sequelize";
import jwt from "jsonwebtoken";
import SECRET_KEY from "../../utils/secretKey";

const postToken: RequestHandler = async (req, res, next) => {
  const clientID: string | undefined = req.body.clientID;
  if (!clientID) {
    return res
      .status(400)
      .send({ status: "error", reason: "missing client ID" });
  }

  const newUser = await User.findOrCreate({
    where: {
      clientID
    }
  });

  const userID: Instance<UserType> = newUser[0].get("id");

  const payload = {
    sub: userID,
    aud: ["Basic"]
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    issuer: "QShare",
    expiresIn: "60min"
  });

  const response = {
    status: "success",
    token
  };

  // To see token data that is sent console.log(jwt.decode(token));
  // console.log(jwt.decode(token));
  return res.status(200).send(response);
};

export default postToken;
