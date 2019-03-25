import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";
import { closeDb } from "./db/setup/dbConnection";

before(() => {
  chai.use(chaiHttp);
});

after(() => {
  closeDb();
});
