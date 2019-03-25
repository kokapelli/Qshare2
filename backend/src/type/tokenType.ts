interface TokenType {
  iat: string;
  iss: string;
  sub: string;
  aud: string[];
  exp: number;
}

export { TokenType };
