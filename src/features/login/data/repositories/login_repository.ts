import { User } from "../../domain/entities/user";
import { LoginRepositoryContract } from "../../domain/repositories/login_repository_contract";

export class LoginRepository implements LoginRepositoryContract {
  getUserForLogin(): User {
    throw new Error("Method not implemented.");
  }
}
