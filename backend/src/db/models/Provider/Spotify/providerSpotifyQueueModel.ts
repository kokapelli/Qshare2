import Sequelize, { Instance } from "sequelize";
import dbConn from "../../../setup/dbConnection";
import ProviderSpotifyQueueType from "../../../types/Provider/Spotify/providerSpotifyQueueType";
import QueueModel from "../../queueModel";

const ProviderSpotifyQueueModel = dbConn.define<
  Instance<ProviderSpotifyQueueType>,
  ProviderSpotifyQueueType
>("providerSpotifyQueue", {
  queueID: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  playlistID: {
    type: Sequelize.UUID,
    unique: true,
    allowNull: false
  }
});

ProviderSpotifyQueueModel.belongsTo(QueueModel, {
  foreignKey: "queueID"
});

export default ProviderSpotifyQueueModel;
