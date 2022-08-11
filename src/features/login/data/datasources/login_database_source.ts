import { Client } from "pg";
import {
  ConnectionError,
  UserNotFoundError,
} from "../../../../core/errors/errors";
import { SessionModel } from "../models/session_model";
import { UserModel } from "../models/user_model";

export interface LoginDatabaseSourceContract {
  getUserForLogin: (email: string) => Promise<UserModel>;
  saveSession: (session: SessionModel) => Promise<void>;
}

export class LoginDatabaseSource implements LoginDatabaseSourceContract {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getUserForLogin = async (email: string) => {
    var response;
    try {
      response = await this.client.query(
        "SELECT * FROM client WHERE email = $1",
        [email]
      );
    } catch (e) {
      throw new ConnectionError();
    }
    if (!response.rows[0]) throw new UserNotFoundError();
    const user = response.rows[0];
    return UserModel.fromJsObject(user);
  };

  saveSession = async (session: SessionModel) => {
    await this.client.query(
      "INSERT INTO session(id_session, jwt_token, login_time, id_user) VALUES ($1, $2, $3, $4)",
      [
        session.idSession,
        session.JWTToken,
        session.loginTime,
        session.user.idUser,
      ]
    );
  };
}
