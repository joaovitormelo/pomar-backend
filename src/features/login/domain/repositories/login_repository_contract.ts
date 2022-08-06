import { User } from "../entities/user";
import { LoginParams } from "../usecases/do_login";

export interface LoginRepositoryContract {
  getUserForLogin: (email: string) => Promise<User>;
}
