import express from "express";
import hello from "./components/test/hello";
import helloPost from "./components/test/helloPost";
import getTracks from "./components/music/getTracks";
import postLogin from "./components/login/postLogin";
import postToken from "./components/login/postToken";
import checkValidToken from "./components/middleware/checkValidToken";
import queueRouter from "./components/queue/queueRouter";
import roomRouter from "./components/room/roomRouter";

const Router = express.Router();

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  Router.get("/hello", hello);
  Router.post("/hello", helloPost);
}

// Music
Router.get("/tracks", checkValidToken, getTracks);

// Login
Router.post("/login", checkValidToken, postLogin);
Router.post("/token", postToken);

// Room
Router.use("/room", checkValidToken, roomRouter);

// Queue
Router.use("/queue", checkValidToken, queueRouter);

export default Router;
