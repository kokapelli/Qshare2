import { AuthSession } from "expo"

export const spotifyRequestAuth = async (url) => {
    return await AuthSession.startAsync({
        authUrl: url,
    })
}