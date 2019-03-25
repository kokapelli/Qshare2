import Sequelize, { Instance } from "sequelize";
import dbConn from "../../../setup/dbConnection";
import SpotifyTokenType from "../../../types/spotifyTokenType";
import User from "../../user";



const SpotifyToken = dbConn.define<Instance<SpotifyTokenType>, SpotifyTokenType>("spotifyToken", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    access_token: {
        type: Sequelize.STRING
    },
    scope: {
        type: Sequelize.STRING
    },
    expiration: {
        type: Sequelize.INTEGER
    },
    refresh_token: {
        type: Sequelize.STRING
    },
    owner: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false
    }
});

SpotifyToken.belongsTo(User, {
    foreignKey: "owner"
});

export default SpotifyToken;