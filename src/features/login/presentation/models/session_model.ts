import { Session } from "../../domain/entities/session";
import { UserModel } from "./user_model";

export class SessionModel implements Session {
  user: UserModel;
  JWTToken: string;
  loginTime: string;

  constructor(user: UserModel, JWTToken: string, loginTime: string) {
    this.user = user;
    this.JWTToken = JWTToken;
    this.loginTime = loginTime;
  }

  toJSObject = () => {
    return {
      user: this.user.toJSObject(),
      JWTToken: this.JWTToken,
      loginTime: this.loginTime,
    };
  };
}
