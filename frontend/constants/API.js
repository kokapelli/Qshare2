let API_IP;
if (process.env.NODE_ENV === "test") {
  API_IP = "127.0.0.1:3000";
} else {
  API_IP = "192.168.10.248:3000";
}

const API_BASE_URL = "http://" + API_IP + "/api";
const API_LOGIN = "/login";
const API_TRACKS = "/tracks";
const API_TOKEN = "/token";
const API_QUEUE = "/queue";
const API_ROOM = "/room";
const API_PLAY = "/play";

const EXPIRATION_TIME = 3600;

export { API_IP, API_BASE_URL, API_LOGIN, API_TRACKS, API_TOKEN, API_QUEUE, API_ROOM, EXPIRATION_TIME, API_PLAY};
