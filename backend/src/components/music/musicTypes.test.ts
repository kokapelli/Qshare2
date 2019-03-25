import { default as chai, assert } from "chai";
import "mocha";
import { QShareTrack, validateQShareTrack} from "./musicTypes";
import { clone, VALID_TRACK } from "../../utils/test/trackExamples";


describe("Internal Track Validator", () => {
    it("should accept complete tracks", () => {
        const track: QShareTrack = clone(VALID_TRACK);

        const trackID = validateQShareTrack(track);
        assert.isTrue(trackID);
    });

    it("should not accept tracks missing URI", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.uri;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });

    it("should not accept tracks missing name", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.name;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });

    it("should not accept tracks missing artists", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.artists;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });

    it("should not accept tracks missing images", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.images;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });
    
    it("should not accept artists missing names", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.artists[0].name;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });
    
    it("should not accept artists missing uri", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.artists[0].uri;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });
    
    it("should not accept images missing urls", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.images[0].url;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });
    
    it("should not accept images missing width", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.images[0].width;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });
    
    it("should not accept images missing height", () => {
        const track: QShareTrack = clone(VALID_TRACK);
        delete track.images[0].height;

        const trackID = validateQShareTrack(track);
        assert.isFalse(trackID);
    });
});