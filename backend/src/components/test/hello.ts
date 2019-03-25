import { RequestHandler } from "express";

const hello: RequestHandler = async (req, res, next) => {
    return res.status(200).send("Hello World!");
};

export default hello;
