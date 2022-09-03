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
  deleteSession: (idSession: number) => Promise<void>;
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
        "SELECT * FROM p.user u INNER JOIN p.person pe ON u.id_person = pe.id_person WHERE pe.email=$1",
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
    try {
      await this.client.query(
        "INSERT INTO p.session(jwt_token, login_time, id_user) VALUES ($1, $2, $3)",
        [session.JWTToken, session.loginTime, session.user.idUser]
      );
    } catch {
      throw new ConnectionError();
    }
  };

  deleteSession = async (idSession: number) => {
    try {
      await this.client.query("DELETE FROM p.session WHERE id_session = $1", [
        idSession,
      ]);
    } catch (e) {
      console.log(e);
      throw new ConnectionError();
    }
  };
}
