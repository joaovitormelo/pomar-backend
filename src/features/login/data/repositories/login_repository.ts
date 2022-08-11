import { Session } from "../../domain/entities/session";
import { LoginRepositoryContract } from "../../domain/repositories/login_repository_contract";
import { LoginDatabaseSourceContract } from "../datasources/login_database_source";
import { PersonModel } from "../models/person_model";
import { SessionModel } from "../models/session_model";
import { UserModel } from "../models/user_model";

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
    const tUserModel = new UserModel(
      1,
      new PersonModel(1, "person_name", "a@a", "person_phone"),
      "password",
      0
    );
    await this.loginDatabaseSource.saveSession(session as SessionModel);
  };
}
