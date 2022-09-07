import { InvalidSessionError } from "../../../../core/errors/errors";
import { TokenGenerator } from "../../utils/token_generator";
import { Session } from "../entities/session";
import { LoginRepositoryContract } from "../repositories/login_repository_contract";

export class DoValidateSession {
  loginRepository: LoginRepositoryContract;
  tokenGenerator: TokenGenerator;

  constructor(
    loginRepository: LoginRepositoryContract,
    tokenGenerator: TokenGenerator
  ) {
    this.loginRepository = loginRepository;
    this.tokenGenerator = tokenGenerator;
  }

  execute = async (session: Session) => {
    const isValidToken = await this.tokenGenerator.verifyJWTToken(
      session.JWTToken
    );
    if (isValidToken) {
      var sessionInDatabase: Session =
        await this.loginRepository.getSessionById(session.idSession);
      if (sessionInDatabase.JWTToken != session.JWTToken) {
        throw new InvalidSessionError();
      }
    } else {
      throw new InvalidSessionError();
    }
  };
}
