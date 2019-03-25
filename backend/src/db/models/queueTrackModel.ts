import dbConn from "../setup/dbConnection";
import Sequelize, { Instance } from "sequelize";
import QueueTrackType from "../types/queueTrackType";
import QueueModel from "./queueModel";

const QueueTrackModel = dbConn.define<Instance<QueueTrackType>, QueueTrackType>("queueTrack", {
    trackQueueID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    queueID: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    data: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    position: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

QueueTrackModel.belongsTo(QueueModel, {
    foreignKey: "queueID"
});

export default QueueTrackModel;