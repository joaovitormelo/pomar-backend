const jwt = require("jsonwebtoken");
require("dotenv").config();

export class TokenGeneratorParams {
  idUser: number;
  email: string;

  constructor(idUser: number, email: string) {
    this.idUser = idUser;
    this.email = email;
  }
}

export interface TokenGeneratorContract {
  generateJWTToken: (params: TokenGeneratorParams) => Promise<string>;
}

export class TokenGenerator implements TokenGeneratorContract {
  generateJWTToken = async (params: TokenGeneratorParams) => {
    return await new Promise<string>((resolve, reject) => {
      const callback = (err, JWTToken) => {
        resolve(JWTToken);
      };
      jwt.sign(
        { idUser: params.idUser, email: params.email },
        process.env.JWT_SECRET,
        callback
      );
    });
  };
}
