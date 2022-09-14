import { InvalidSessionError } from "../../../core/errors/errors";

const jwt = require("jsonwebtoken");
require("dotenv").config();

export class TokenGeneratorParams {
  idUser: number;
  email: string;

  constructor(idUser: number, email: string) {
    this.idUser = idUser;
  }
}

export interface TokenGeneratorContract {
  generateJWTToken: (params: TokenGeneratorParams) => Promise<string>;
  verifyJWTToken: (token: string) => Promise<any>;
}

export class TokenGenerator implements TokenGeneratorContract {
  generateJWTToken = async (params: TokenGeneratorParams) => {
    return await new Promise<string>((resolve, reject) => {
      const callback = (err, JWTToken) => {
        if (err) reject(new InvalidSessionError());
        resolve(JWTToken);
      };
      jwt.sign(
        { idUser: params.idUser, email: params.email },
        process.env.JWT_SECRET,
        callback
      );
    });
  };

  verifyJWTToken = async (token: string) => {
    return await new Promise<string>((resolve, reject) => {
      const callback = (err, decoded) => {
        if (err) throw new InvalidSessionError();
        resolve(decoded);
      };
      jwt.verify(token, process.env.JWT_SECRET, callback);
    });
  };
}
