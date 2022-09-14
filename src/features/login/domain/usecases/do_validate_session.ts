import {
  ConnectionError,
  InvalidSessionError,
} from "../../../../core/errors/errors";
import {
  TokenGenerator,
  TokenGeneratorContract,
} from "../../utils/token_generator";
import { Session } from "../entities/session";
import { LoginRepositoryContract } from "../repositories/login_repository_contract";

export class DoValidateSession {
  loginRepository: LoginRepositoryContract;
  tokenGenerator: TokenGeneratorContract;

  constructor(
    loginRepository: LoginRepositoryContract,
    tokenGenerator: TokenGeneratorContract
  ) {
    this.loginRepository = loginRepository;
    this.tokenGenerator = tokenGenerator;
  }

  execute = async (jwtToken: string) => {
    try {
      const validToken = await this.tokenGenerator.verifyJWTToken(jwtToken);
      if (validToken) {
        await this.loginRepository.getSessionByToken(jwtToken);
      } else {
        throw new InvalidSessionError();
      }
    } catch (e) {
      if (e instanceof ConnectionError) throw e;
      else throw new InvalidSessionError();
    }
  };
}
