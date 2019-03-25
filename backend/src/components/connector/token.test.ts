import {assert} from "chai";
import "mocha";
import { Token } from "./token";
import moveTimeForwardSeconds from "../testUtils/timeControl";

describe("Token", () => {
    describe("Expiration dates creation", () => {
        it("should create expiration date with no offset", () => {
            const offset = 0;
            const before = new Date();
            const expiration = Token.getExpirationDate(offset);
            const after = new Date();

            assert(expiration <= after);
            assert(expiration >= before);
        });

        it("should create expiration date with offset", () => {
            const offset = 3600;
            const before = new Date();
            const expiration = Token.getExpirationDate(offset);
            moveTimeForwardSeconds(offset);
            const after = new Date();

            assert(expiration <= after);
            assert(expiration >= before);
        });

        it("should not create expiration date with negative offset", () => {
            const offset = -1;
            assert.throws(() => Token.getExpirationDate(offset), Error);
        });
    });

    describe("Constructor", () => {
        it("should create invalid token with no arguments", () => {
            const token: Token = new Token();
            assert.isFalse(token.isValid());
        });

        it("should create invalid token with only token string", () => {
            const token: Token = new Token("abc");
            assert.isFalse(token.isValid());
        });

        it("should create invalid token with empty token string", () => {
            const token: Token = new Token("");
            assert.isFalse(token.isValid());
        });

        it("should create invalid token with zero expiration time", () => {
            const token: Token = new Token("abc", 0);
            assert.isFalse(token.isValid());
        });

        it("should not create token with negative expiration time", () => {
            assert.throws(() => new Token("abc", -1), Error);
        });

        it("should create valid token with expiration time and token string", () => {
            const token: Token = new Token("abc", 1);
            assert(token.isValid());
        });
    });

    describe("hasExpired", () => {
        it("should return true on invalid token", () => {
            const token: Token = new Token();
            assert(token.hasExpiered());
        });

        it("should return true on zero expiration time", () => {
            const token: Token = new Token("abc", 0);
            assert(token.hasExpiered());
        });
        
        it("should return false when time left until expiration", () => {
            const token: Token = new Token("abc", 1);
            assert.isFalse(token.hasExpiered());
        });
        
        it("should return true when time has passed until expiration", () => {
            const token: Token = new Token("abc", 3600);
            moveTimeForwardSeconds(3600);
            assert(token.hasExpiered());
        });
    });
});