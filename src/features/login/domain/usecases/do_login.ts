import {
  AuthenticationError,
  InvalidValueError,
} from "../../../../core/errors/errors";
import { EncrypterContract } from "../../../../core/utils/encrypter";
import { ValidatorContract } from "../../../../core/utils/validator";
import { TimerContract } from "../../utils/timer";
import {
  TokenGeneratorContract,
  TokenGeneratorParams,
} from "../../utils/token_generator";
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
  encrypter: EncrypterContract;
  tokenGenerator: TokenGeneratorContract;
  timer: TimerContract;

  constructor(
    loginRepository: LoginRepositoryContract,
    encrypter: EncrypterContract,
    tokenGenerator: TokenGeneratorContract,
    timer: TimerContract
  ) {
    this.loginRepository = loginRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.timer = timer;
  }

  async execute(params: LoginParams) {
    var user: User = await this.loginRepository.getUserForLogin(params.email);
    const match = await this.encrypter.comparePassword(
      params.password,
      user.password
    );
    if (!match) {
      throw new AuthenticationError();
    } else {
      const token = await this.tokenGenerator.generateJWTToken(
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
