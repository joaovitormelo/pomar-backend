import {
  AuthenticationError,
  InvalidValueError,
} from "../../../../core/errors/errors";
import { EncrypterContract } from "../../../../core/utils/encrypter";
import { ValidatorContract } from "../../../../core/utils/validator";
import { TimerContract } from "../../utils/Timer";
import {
  TokenGeneratorContract,
  TokenGeneratorParams,
} from "../../utils/TokenGenerator";
import { Session } from "../entities/session";
import { User } from "../entities/user";
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
  encrypter: EncrypterContract;
  tokenGenerator: TokenGeneratorContract;
  timer: TimerContract;

  constructor(
    loginRepository: LoginRepositoryContract,
    validator: ValidatorContract,
    encrypter: EncrypterContract,
    tokenGenerator: TokenGeneratorContract,
    timer: TimerContract
  ) {
    this.loginRepository = loginRepository;
    this.validator = validator;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.timer = timer;
  }

  async execute(params: LoginParams) {
    var user: User;
    if (!this.validator.validateEmail(params.email)) {
      throw new InvalidValueError("email");
    } else if (!this.validator.validatePassword(params.password)) {
      throw new InvalidValueError("password");
    }
    user = await this.loginRepository.getUserForLogin(params.email);
    const passwordHash = this.encrypter.encryptPassword(params.password);
    if (passwordHash != user.password) {
      throw new AuthenticationError();
    } else {
      const token = this.tokenGenerator.generateJWTToken(
        new TokenGeneratorParams(user.idUser, user.person.email)
      );
      const timeNow = this.timer.getTimeNow();
      user.password = "";
      const session = new Session(1, user, token, timeNow);
      this.loginRepository.saveSession(session);
      return session;
    }
  }
}
