import crypto from "crypto";

const SECRET_KEY = crypto.randomBytes(256);

export default SECRET_KEY;
