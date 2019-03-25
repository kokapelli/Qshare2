import { Token } from "../token";
import axiosSpotifyTokenLevel from "../../../axiosInstances/axiosSpotifyTokenLevel";
import { CLIENT_ID } from "../../constants/spotify";
import { InterfaceConnector } from "./InterfaceConnector";

export class SpotifyConnectorTokenLevel implements InterfaceConnector {
  private static instance: SpotifyConnectorTokenLevel;

  private static clientSecret: string = "9d73918233f44a20a6c73ffe19a90dff";

  private token: Token = new Token();

  private static SPOTIFY_API_URL_TOKEN: string =
    "https://accounts.spotify.com/api/token";

  constructor() {
    if (SpotifyConnectorTokenLevel.instance) {
      return SpotifyConnectorTokenLevel.instance;
    } else {
      SpotifyConnectorTokenLevel.instance = this;
    }
  }

  /**
   * Resets the connector by overriding the previous token.
   */
  public reset() {
    this.token = new Token();
  }

  public get = async (url: string) => {
    await this.verifyToken();
    return await axiosSpotifyTokenLevel.get(url);
  }

  public put = async (url: string) => {
    await this.verifyToken();
    return await axiosSpotifyTokenLevel.put(url);
  }

  public delete = async (url: string) => {
    await this.verifyToken();
    return await axiosSpotifyTokenLevel.delete(url);
  }

  public post = async (url: string) => {
    await this.verifyToken();
    return await axiosSpotifyTokenLevel.post(url);
  }

  public postAuth = async (url: string) => {
    await this.verifyToken();
    return await axiosSpotifyTokenLevel.post(url, undefined, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            CLIENT_ID + ":" + SpotifyConnectorTokenLevel.clientSecret
          ).toString("base64")
      }
    });
  }

  private verifyToken = async () => {
    if (this.token.hasExpiered()) {
      const token = await this.requestAccessToken();
      this.token = token;
      if (token.isValid()) {
        axiosSpotifyTokenLevel.defaults.headers.common.Authorization =
          "Bearer " + token.getTokenString();
      }
    }
  }

  private requestAccessToken = async (): Promise<Token> => {
    try {
      const requestToken = await axiosSpotifyTokenLevel.post(
        SpotifyConnectorTokenLevel.SPOTIFY_API_URL_TOKEN,
        undefined,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                CLIENT_ID + ":" + SpotifyConnectorTokenLevel.clientSecret
              ).toString("base64")
          },
          params: {
            grant_type: "client_credentials"
          }
        }
      );
      const newToken = requestToken.data.access_token;
      const expiresIn = requestToken.data.expires_in;
      const token = new Token(newToken, expiresIn);

      return token;
    } catch (e) {
      console.error("Unable to request access token: " + e);
      return new Token();
    }
  }
}
