import Sequelize, { Instance } from "sequelize";
import dbConn from "../setup/dbConnection";
import ExampleType from "../types/exampleType";

const Example = dbConn.define<Instance<ExampleType>, ExampleType>("example", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

export default Example;