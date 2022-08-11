import { User } from "./user";

export class Session {
  idSession: number;
  user: User;
  JWTToken: string;
  loginTime: string;

  constructor(
    idSession: number,
    user: User,
    JWTToken: string,
    loginTime: string
  ) {
    this.idSession = idSession;
    this.user = user;
    this.JWTToken = JWTToken;
    this.loginTime = loginTime;
  }
}
