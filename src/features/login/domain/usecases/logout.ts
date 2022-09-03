import { LoginRepositoryContract } from "../repositories/login_repository_contract";

export class Logout {
  loginRepository: LoginRepositoryContract;

  constructor(loginRepository: LoginRepositoryContract) {
    this.loginRepository = loginRepository;
  }

  execute = async (idSession: number) => {
    await this.loginRepository.deleteSession(idSession);
  };
}
