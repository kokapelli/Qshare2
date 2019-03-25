import timekeeper from "timekeeper";

function moveTimeForwardSeconds(seconds: number) {
    const now = new Date();
    timekeeper.travel(new Date(now.getTime() + 1000*seconds));
}

export default moveTimeForwardSeconds;