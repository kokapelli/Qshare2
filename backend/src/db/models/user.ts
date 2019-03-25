import Sequelize, { Instance } from "sequelize";
import dbConn from "../setup/dbConnection";
import UserType from "../types/userType";

const User = dbConn.define<Instance<UserType>, UserType>("user", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    clientID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

export default User;