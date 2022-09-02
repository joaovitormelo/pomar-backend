import { Session } from "../../domain/entities/session";
import { LoginRepositoryContract } from "../../domain/repositories/login_repository_contract";
import { LoginDatabaseSourceContract } from "../datasources/login_database_source";
import { SessionModel } from "../models/session_model";

export class LoginRepository implements LoginRepositoryContract {
  loginDatabaseSource: LoginDatabaseSourceContract;

  constructor(loginDatabaseSource: LoginDatabaseSourceContract) {
    this.loginDatabaseSource = loginDatabaseSource;
  }
  getUserForLogin = async (email: string) => {
    const user = await this.loginDatabaseSource.getUserForLogin(email);
    return user;
  };

  saveSession = async (session: Session) => {
    await this.loginDatabaseSource.saveSession(session as SessionModel);
  };

  deleteSession = async (idSession: number) => {
    //throw new ConnectionError();
  };
}
