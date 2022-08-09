import { Session } from "../../domain/entities/session";
import { User } from "../../domain/entities/user";
import { LoginRepositoryContract } from "../../domain/repositories/login_repository_contract";
import { LoginDatabaseSourceContract } from "../datasources/login_database_source";

export class LoginRepository implements LoginRepositoryContract {
  loginDatabaseSource: LoginDatabaseSourceContract;

  constructor(loginDatabaseSource: LoginDatabaseSourceContract) {
    this.loginDatabaseSource = loginDatabaseSource;
  }
  getUserForLogin = async (email: string) => {
    try {
      const user = await this.loginDatabaseSource.getUserForLogin(email);
      return user;
    } catch (e) {
      throw e;
    }
  };
  saveSession = async (session: Session) => {
    await this.loginDatabaseSource.saveSession(session);
  };
}
