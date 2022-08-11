import { JsonwebtokenWrapper } from "../../../main/wrappers/jsonwebtoken_wrapper";
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
  jsonwebtokenWrapper: JsonwebtokenWrapper;

  constructor(jsonwebtokenWrapper: JsonwebtokenWrapper) {
    this.jsonwebtokenWrapper = jsonwebtokenWrapper;
  }

  generateJWTToken = async (params: TokenGeneratorParams) => {
    return await new Promise<string>((resolve, reject) => {
      const callback = (JWTToken: string) => {
        resolve(JWTToken);
      };
      this.jsonwebtokenWrapper.sign(
        { idUser: params.idUser, email: params.email },
        process.env.JWT_SECRET,
        callback
      );
    });
  };
}
