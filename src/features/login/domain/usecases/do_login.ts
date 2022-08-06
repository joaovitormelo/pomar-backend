import {
  AuthenticationError,
  InvalidValueError,
} from "../../../../core/errors/errors";
import { EncrypterContract } from "../../../../core/utils/encrypter_contract";
import { ValidatorContract } from "../../../../core/utils/validator_contract";
import { Timer } from "../../utils/Timer";
import { TokenGeneratorContract } from "../../utils/TokenGenerator";
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
  timer: Timer;

  constructor(
    loginRepository: LoginRepositoryContract,
    validator: ValidatorContract,
    encrypter: EncrypterContract,
    tokenGenerator: TokenGeneratorContract,
    timer: Timer
  ) {
    this.loginRepository = loginRepository;
    this.validator = validator;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.timer = timer;
  }

  async execute(params: LoginParams) {
    var user: User;
    try {
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
        const token = this.tokenGenerator.generateJWTToken(passwordHash);
        const timeNow = this.timer.getTimeNow();
        const session = new Session(user.idUser, token, timeNow);
        this.loginRepository.saveSession(session);
        return session;
      }
    } catch (e) {
      throw e;
    }
  }
}
