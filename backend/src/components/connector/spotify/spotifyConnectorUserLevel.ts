import { Token } from "../token";
import { InterfaceConnector } from "./InterfaceConnector";
import Axios, { AxiosInstance } from "axios";
import SpotifyToken from "../../../db/models/Provider/Spotify/spotifyToken";

export class SpotifyConnectorUserLevel implements InterfaceConnector {
  private token: Token = new Token();
  private userID: string;
  private axiosSpotifyUserLevel: AxiosInstance = Axios.create();

  constructor(userID: string) {
    this.userID = userID;
  }

  /**
   * Resets the connector by overriding the previous token.
   */
  public reset() {
    this.token = new Token();
  }

  public get = async (url: string) => {
    await this.verifyToken();
    return await this.axiosSpotifyUserLevel.get(url);
  }

  public put = async (url: string, body?: {}) => {
    await this.verifyToken();
    return await this.axiosSpotifyUserLevel.put(url, body);
  }

  public delete = async (url: string) => {
    await this.verifyToken();
    return await this.axiosSpotifyUserLevel.delete(url);
  }

  public post = async (url: string, body?: {}) => {
    await this.verifyToken();
    try {
      return await this.axiosSpotifyUserLevel.post(url, body);
    } catch (e) {
      return e;
    }
  }

  private verifyToken = async () => {
    if (this.token.hasExpiered()) {
      const token = await this.requestAccessToken();
      this.token = token;
      if (token.isValid()) {
        this.axiosSpotifyUserLevel.defaults.headers.common.Authorization =
          "Bearer " + token.getTokenString();
      }
    }
  }

  private requestAccessToken = async (): Promise<Token> => {
    const token = await SpotifyToken.findOne({
      where: {
        owner: this.userID
      }
    });

    return token
      ? new Token(token.get("access_token"), token.get("expiration"))
      : new Token();
  }
}
