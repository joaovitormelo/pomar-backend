import { User } from "./user";

export class Session {
  user: User;
  JWTToken: string;
  loginTime: string;

  constructor(user: User, JWTToken: string, loginTime: string) {
    this.user = user;
    this.JWTToken = JWTToken;
    this.loginTime = loginTime;
  }
}
