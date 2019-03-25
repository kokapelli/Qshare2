import { insertMockUsers } from "./insertMockUsers";
import { insertMockRooms } from "./insertMockRooms";
import { insertMockQueues } from "./insertMockQueues";
export async function insertMockRoomChain() {
    await insertMockUsers();
    await insertMockQueues();
    await insertMockRooms();
}
