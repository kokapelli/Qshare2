import dbConn from "./dbConnection";
import Example from "../models/example";
import User from "../models/user";
import Room from "../models/room";
import AssociatedUserRoom from "../models/associatedUsersRoom";
import QueueModel from "../models/queueModel";
import QueueTrackModel from "../models/queueTrackModel";
import { insertMockRoomChain } from "../../utils/test/insertMockRoomChain";
import ProviderSpotifyQueueModel from "../models/Provider/Spotify/providerSpotifyQueueModel";
import ProviderSpotifyUserModel from "../models/Provider/Spotify/providerSpotifyUserModel";

const initializeDB = async () => {
  // Always start with a clean db if test or development enviroment
  await dbConn.sync({
    force:
      process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
  });

  /**
   * Sequelize won't do anything until it really have to.
   * While developing you probably want the entire database to always be
   * initialized such that debugging can be done more efficently.
   *
   * When you call sync() on a Sequelize instance you force Sequelize to
   * run a create table query
   */
  await Example.sync();
  await User.sync();
  await Room.sync();
  await AssociatedUserRoom.sync();
  await QueueModel.sync();
  await QueueTrackModel.sync();
  await ProviderSpotifyQueueModel.sync();
  await ProviderSpotifyUserModel.sync();

  if (process.env.NODE_ENV === "development") {
    await insertMockRoomChain();
  }
};

export { initializeDB };
