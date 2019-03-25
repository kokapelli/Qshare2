import Sequelize, { Instance } from "sequelize";
import dbConn from "../setup/dbConnection";
import RoomType from "../types/roomType";
import User from "./user";
import QueueModel from "./queueModel";

const Room = dbConn.define<Instance<RoomType>, RoomType>("room", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    owner: {
        type: Sequelize.UUID,
        allowNull: false,
        
    },
    queueID: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

User.hasMany(Room, {
    foreignKey: "owner",
    sourceKey: "id"
});

Room.hasOne(QueueModel, {
    foreignKey: "queueID"
});

export default Room;