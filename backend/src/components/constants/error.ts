const STATUS_ERROR_STR: string = "error";
const REASON_DENIED_STR: string = "denied";
const MISSING_VALUES_STR: string = "missing_req_values";

const MISSING_VALUES: {} = {
  status: STATUS_ERROR_STR,
  reason: MISSING_VALUES_STR
};
const TOKEN_INVALID: {} = {
  status: STATUS_ERROR_STR,
  reason: "token_invalid"
};

const PROVIDER_TOKEN_INVALID: {} = {
  status: STATUS_ERROR_STR,
  reason: "provider_token_invalid"
};

const ERROR_AUTH: {} = {
  status: STATUS_ERROR_STR,
  reason: REASON_DENIED_STR
};

const ERROR_TOKEN: {} = {
  status: STATUS_ERROR_STR,
  reason: "token"
};

const ERROR_ACTION: {} = {
  status: STATUS_ERROR_STR,
  reason: "action"
};

const ERROR_USERID: {} = {
  status: STATUS_ERROR_STR,
  reason: "userID"
};

const ERROR_ROOMID: {} = {
  status: STATUS_ERROR_STR,
  reason: "roomID"
};

const ERROR_QUEUEID: {} = {
  status: STATUS_ERROR_STR,
  reason: "queueID"
};

const ERROR_TRACK: {} = {
  status: STATUS_ERROR_STR, 
  reason: "track_invalid"
};

const ERROR_MISSING_SPOTIFY_TOKEN: {} = {
  status: STATUS_ERROR_STR, 
  reason: "missing_spotify_token_level"
};

const ERROR_BAN: {} = {
  status: STATUS_ERROR_STR,
  reason: "banned"
};

const ERROR_BODY: {} = { status: STATUS_ERROR_STR };

export {
  MISSING_VALUES,
  TOKEN_INVALID,
  PROVIDER_TOKEN_INVALID,
  ERROR_BODY,
  ERROR_ROOMID,
  ERROR_USERID,
  ERROR_QUEUEID,
  ERROR_TRACK,
  ERROR_ACTION,
  ERROR_AUTH,
  ERROR_TOKEN,
  ERROR_BAN,
  ERROR_MISSING_SPOTIFY_TOKEN,
  STATUS_ERROR_STR,
  REASON_DENIED_STR,
  MISSING_VALUES_STR
};
