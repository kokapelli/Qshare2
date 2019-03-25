import Sequelize, { Instance } from "sequelize";
import dbConn from "../../../setup/dbConnection";
import User from "../../user";
import ProviderSpotifyUserType from "../../../types/Provider/Spotify/providerSpotifyUserType";

const ProviderSpotifyUserModel = dbConn.define<
  Instance<ProviderSpotifyUserType>,
  ProviderSpotifyUserType
>("providerSpotifyUserModel", {
  userID: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  spotifyUserID: {
    type: Sequelize.UUID,
    unique: true,
    allowNull: false
  }
});

ProviderSpotifyUserModel.belongsTo(User, {
  foreignKey: "userID"
});

export default ProviderSpotifyUserModel;
