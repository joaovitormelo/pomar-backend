import { Client } from "pg";
import {
  ConnectionError,
  NoDataError,
  UserNotFoundError,
} from "../../../../core/errors/errors";
import { Session } from "../../domain/entities/session";
import { SessionModel } from "../models/session_model";
import { UserModel } from "../models/user_model";

export interface LoginDatabaseSourceContract {
  getUserForLogin: (email: string) => Promise<UserModel>;
  saveSession: (session: SessionModel) => Promise<number>;
  deleteSession: (idSession: number) => Promise<void>;
  getSessionById: (idSession: number) => Promise<Session>;
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
    return UserModel.fromDatabase(user);
  };

  saveSession = async (session: SessionModel) => {
    try {
      const result = await this.client.query(
        "INSERT INTO p.session(jwt_token, login_time, id_user) VALUES ($1, $2, $3) RETURNING id_session",
        [session.JWTToken, session.loginTime, session.user.idUser]
      );
      return result.rows[0].id_session;
    } catch (e) {
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

  getSessionById = async (idSession: number) => {
    try {
      const result = await this.client.query(
        "SELECT * FROM p.session s INNER JOIN p.user u ON s.id_user = u.id_user INNER JOIN p.person pe ON u.id_person = pe.id_person WHERE s.id_session = $1",
        [idSession]
      );
      if (result.rowCount == 0) throw new NoDataError();
      return SessionModel.fromDatabase(result.rows[0]);
    } catch (e) {
      if (e instanceof NoDataError) throw e;
      else throw new ConnectionError();
    }
  };
}
