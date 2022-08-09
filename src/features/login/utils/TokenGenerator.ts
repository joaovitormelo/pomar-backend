export class TokenGeneratorParams {
  idUser: number;
  email: string;

  constructor(idUser: number, email: string) {
    this.idUser = idUser;
    this.email = email;
  }
}

export interface TokenGeneratorContract {
  generateJWTToken: (params: TokenGeneratorParams) => string;
}
