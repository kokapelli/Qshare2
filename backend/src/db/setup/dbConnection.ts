import Sequelize from "sequelize";

let DB_OPTIONS: Sequelize.Options = {};
DB_OPTIONS = {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  operatorsAliases: false
};

const dbConn: Sequelize.Sequelize = new Sequelize(
  "music",
  "music",
  "music",
  DB_OPTIONS
);

const openDb = async () => {
  try {
    await dbConn.authenticate();
    console.log("Connected to database");
  } catch (e) {
    console.log("Error connecting to database ", e);
  }
};

const closeDb = async () => {
  try {
    dbConn.close();
    console.log("Closed connection to database");
  } catch (e) {
    console.log("Error trying to close connection to database ", e);
  }
};

export default dbConn;
export { openDb, closeDb };
