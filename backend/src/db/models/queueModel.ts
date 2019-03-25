import dbConn from "../setup/dbConnection";
import QueueType from "../types/queueType";
import Sequelize, { Instance } from "sequelize";

const QueueModel = dbConn.define<Instance<QueueType>, QueueType>("queue", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

export default QueueModel;