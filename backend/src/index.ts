import app from "./app";
import * as http from "http";
import { openDb, closeDb } from "./db/setup/dbConnection";
import dbConn from "./db/setup/dbConnection";
import Example from "./db/models/example";
import { createExampleInsert } from "./db/models/exampleInsert";
import User from "./db/models/user";
import Room from "./db/models/room";
import AssociatedUserRoom from "./db/models/associatedUsersRoom";
import { associatedUsersRoomInsert } from "./db/exampleData/associatedUsersRoomInsert";
import SpotifyToken from "./db/models/Provider/Spotify/spotifyToken";
import { initializeDB } from "./db/setup/dbSetup";

let httpServer: http.Server | undefined;

async function startServer() {
  await openDb();
  if (process.env.NODE_ENV !== "test") {
    await initializeDB();
  }
  httpServer = http.createServer(app);
  httpServer.listen(3000, () => console.log("Started HTTP server at 3000"));
}
startServer();

const forceSync = async () => {
    // Always start with a clean db if test or development enviroment
    await dbConn.sync({
        force:
            process.env.NODE_ENV === "test" ||
            process.env.NODE_ENV === "development"
    });

    /**
     * Sequelize won't do anything until it really have to.
     * While developing you probably want the entire database to always be
     * initialized such that debugging can be done more efficently.
     *
     * When you call sync() on a Sequelize instance you force Sequelize to
     * run a create table query
     */
    Example.sync();
    User.sync();
    Room.sync();
    AssociatedUserRoom.sync();
    SpotifyToken.sync();
    createExampleInsert();
    associatedUsersRoomInsert();
};

process.stdin.resume(); // so the program will not close instantly

async function exitHandler() {
  if (httpServer) {
    httpServer.close();
    closeDb();
  }

  process.exit();
}

// do something when app is closing
process.on("exit", exitHandler.bind(null));

// catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null));
process.on("SIGUSR2", exitHandler.bind(null));

// catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null));
