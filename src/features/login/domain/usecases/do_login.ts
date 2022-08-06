import { UserNotFound } from "../../../../core/errors/errors";
import { ValidatorContract } from "../../../../core/utils/validator_contract";
import { LoginRepositoryContract } from "../repositories/login_repository_contract";

export class LoginParams {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export default class DoLogin {
  loginRepository: LoginRepositoryContract;
  validator: ValidatorContract;

  constructor(
    loginRepository: LoginRepositoryContract,
    validator: ValidatorContract
  ) {
    this.loginRepository = loginRepository;
    this.validator = validator;
  }

  async execute(params: LoginParams) {
    try {
      this.validator.validatePassword(params.password);
      await this.loginRepository.getUserForLogin(params.email);
    } catch (e) {
      throw e;
    }
  }
}
