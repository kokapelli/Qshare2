import Room from "../../db/models/room";
import User from "../../db/models/user";
import {
  MOCK_ID_1,
  MOCK_CLIENTID_1,
  insertMockUsers,
  MOCK_ID_2,
  MOCK_ID_3
} from "./insertMockUsers";
import AssociatedUserRoom from "../../db/models/associatedUsersRoom";
import { insertMockQueues, QUEUE_ID_1, QUEUE_ID_2, QUEUE_ID_3, QUEUE_ID_4 } from "./insertMockQueues";
import QueueModel from "../../db/models/queueModel";

const ROOM_ID_1: string = "76f3c205-b9ac-4017-98ce-4aa99893622c";
const ROOM_ID_2: string = "fb14de2e-4216-4c98-9697-12e409fd2385";
const ROOM_ID_3: string = "97d4aaf0-dc54-42ac-93de-f0650eeb6992";
const ROOM_ID_4: string = "34ea71b9-c6c9-4771-92ec-f5200d76b59a";

const insertMockRooms = async () => {
  const checkUser = await User.findOne({
    where: { id: MOCK_ID_1, clientID: MOCK_CLIENTID_1 }
  });
  if (!checkUser) {
    insertMockUsers();
  }

  const checkQueue = await QueueModel.findOne({
    where: { id: QUEUE_ID_1 }
  });
  if (!checkQueue) {
    insertMockQueues();
  }
  
  const room1 = await Room.create({
    id: ROOM_ID_1,
    owner: MOCK_ID_1,
    queueID: QUEUE_ID_1
  });
  const room2 = await Room.create({
    id: ROOM_ID_2,
    owner: MOCK_ID_1,
    queueID: QUEUE_ID_2
  });
  const room3 = await Room.create({
    id: ROOM_ID_3,
    owner: MOCK_ID_1,
    queueID: QUEUE_ID_3
  });

  await AssociatedUserRoom.create({
    userID: MOCK_ID_2,
    roomID: ROOM_ID_1
  });

  await AssociatedUserRoom.create({
    userID: MOCK_ID_2,
    roomID: ROOM_ID_2
  });

  await AssociatedUserRoom.create({
    userID: MOCK_ID_2,
    roomID: ROOM_ID_3
  });

  await AssociatedUserRoom.create({
    userID: MOCK_ID_3,
    roomID: ROOM_ID_1
  });

  await AssociatedUserRoom.create({
    userID: MOCK_ID_3,
    roomID: ROOM_ID_2
  });

};

export { insertMockRooms, ROOM_ID_1, ROOM_ID_2, ROOM_ID_3, ROOM_ID_4 };
