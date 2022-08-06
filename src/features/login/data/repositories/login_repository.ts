import { Session } from "../../domain/entities/session";
import { User } from "../../domain/entities/user";
import { LoginRepositoryContract } from "../../domain/repositories/login_repository_contract";

export class LoginRepository implements LoginRepositoryContract {
  getUserForLogin: (email: string) => Promise<User>;
  saveSession: (session: Session) => Promise<void>;
}
