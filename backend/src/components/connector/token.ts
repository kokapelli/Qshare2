export class Token {
    private expirationDate: Date = new Date();
    private token: string = "";

    /**
     * Creating a new token.
     * Will create an invalid token if missing any arguments
     * @constructor
     * @param token String representation of the token
     * @param expiresIn Number of seconds until the token expires
     */
    constructor(token?: string, expiresIn?: number) {
        if (token) {
            this.token = token;
        }

        if (expiresIn) {
            this.expirationDate = Token.getExpirationDate(expiresIn);
        }
        else {
            this.expirationDate = new Date();
        }
    }

    /**
     * Is the token valid and ready to be used for requests
     */
    public isValid() {
        return this.token !== "" && !this.hasExpiered();
    }

    /**
     * Get a string representation of the token to be used in requests
     */
    public getTokenString(): string {
        return this.token;
    }

    /**
     * Create an expiration date to keep track when the token has expired
     * @param expiresIn Time in seconds until the token will expire
     */
    public static getExpirationDate(expiresIn: number): Date {
        if (expiresIn < 0) {throw new Error("Cannot create expiration date with negative offset");}
        const now = new Date();
        return new Date(now.getTime() + 1000 * expiresIn);
    }
    
    /**
     * Has the token expired and needs to be refreshed
     */
    public hasExpiered() {
        const now = new Date();
        return now >= this.expirationDate;
    }
}
