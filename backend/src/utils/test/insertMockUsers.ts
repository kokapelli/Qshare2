import User from "../../db/models/user";
import ProviderSpotifyUserModel from "../../db/models/Provider/Spotify/providerSpotifyUserModel";

const MOCK_ID_1: string = "457509ef-46d2-411a-9422-07d9adb13813";
const MOCK_CLIENTID_1: string = "client1";
const MOCK_SPOTIFY_ID_1: string = "spotifymockuseridmockid1";

const MOCK_ID_2: string = "5e0f43f8-1cf4-48a1-b22e-0e2504cb104a";
const MOCK_CLIENTID_2: string = "afd8-fk2ji7";

const MOCK_ID_3: string = "2d87455b-5947-4c95-a6bd-08214a877a76";
const MOCK_CLIENTID_3: string = "afd8-fk2ji8";

const insertMockUsers = async () => {
  await User.findOrCreate({
    where: { id: MOCK_ID_1, clientID: MOCK_CLIENTID_1 }
  });
  await User.findOrCreate({
    where: { id: MOCK_ID_2, clientID: MOCK_CLIENTID_2 }
  });
  await User.findOrCreate({
    where: { id: MOCK_ID_3, clientID: MOCK_CLIENTID_3 }
  });
  await ProviderSpotifyUserModel.findOrCreate({where: {
    userID: MOCK_ID_3, spotifyUserID: MOCK_SPOTIFY_ID_1
  }});
};

export {
  insertMockUsers,
  MOCK_ID_1,
  MOCK_CLIENTID_1,
  MOCK_SPOTIFY_ID_1,
  MOCK_ID_2,
  MOCK_CLIENTID_2,
  MOCK_ID_3,
  MOCK_CLIENTID_3
};
