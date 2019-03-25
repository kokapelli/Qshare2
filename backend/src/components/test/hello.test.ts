import { default as chai, assert } from "chai";
import app from "../../app";

import "mocha";

const ENDPOINT = "/api/hello";

describe(`GET ${ENDPOINT}`, () => {
    it("should return 200 status", async () => {
        const response = await chai
            .request(app)
            .get(ENDPOINT)
            .send();

        assert.equal(response.status, 200);
    });
});
