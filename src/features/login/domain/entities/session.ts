export class Session {
  idUser: number;
  JWTToken: string;
  loginTime: string;

  constructor(idUser: number, JWTToken: string, loginTime: string) {
    this.idUser = idUser;
    this.JWTToken = JWTToken;
    this.loginTime = loginTime;
  }
}
