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
      id_session: this.idSession,
      user: this.user.toJSObject(),
      jwt_token: this.JWTToken,
      login_time: this.loginTime,
    };
  };

  static fromEntity = (session: Session) => {
    return new SessionModel(
      session.idSession,
      UserModel.fromEntity(session.user),
      session.JWTToken,
      session.loginTime
    );
  };
}
