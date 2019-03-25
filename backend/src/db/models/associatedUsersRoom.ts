import Sequelize, { Instance } from "sequelize";
import dbConn from "../setup/dbConnection";
import AssociatedUserRoomType from "../types/associatedUsersRoomType";
import User from "./user";
import Room from "./room";

const AssociatedUserRoom = dbConn.define<
    Instance<AssociatedUserRoomType>,
    AssociatedUserRoomType
>("associatedUserRoom", {
    userID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    roomID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    banned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

User.hasMany(AssociatedUserRoom, {
    foreignKey: "userID",
    sourceKey: "id"
});

Room.hasMany(AssociatedUserRoom, {
    foreignKey: "roomID",
    sourceKey: "id"
});

export default AssociatedUserRoom;
