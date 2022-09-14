import { Session } from "../entities/session";
import { User } from "../entities/user";

export interface LoginRepositoryContract {
  getUserForLogin: (email: string) => Promise<User>;
  saveSession: (session: Session) => Promise<number>;
  deleteSession: (idSession: number) => Promise<void>;
  getSessionByToken: (jwtToken: string) => Promise<Session>;
}
