import { Session } from "../../domain/entities/session";
import { MyModel } from "./my_model";
import { UserModel } from "./user_model";

export class SessionModel extends Session implements MyModel {
  user: UserModel;

  constructor(
    idSession: number,
    user: UserModel,
    JWTToken: string,
    loginTime: string
  ) {
    super(idSession, user, JWTToken, loginTime);
  }

  toJSObject = () => {
    return {
      idSession: this.idSession,
      user: this.user.toJSObject(),
      JWTToken: this.JWTToken,
      loginTime: this.loginTime,
    };
  };
}
