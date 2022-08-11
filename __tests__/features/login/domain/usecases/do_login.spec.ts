import { LoginRepositoryContract } from "../../../../../src/features/login/domain/repositories/login_repository_contract";
import DoLogin, {
  LoginParams,
} from "../../../../../src/features/login/domain/usecases/do_login";
import {
  AuthenticationError,
  ConnectionError,
  InvalidValueError,
  UserNotFoundError,
} from "../../../../../src/core/errors/errors";
import { ValidatorContract } from "../../../../../src/core/utils/validator";
import { EncrypterContract } from "../../../../../src/core/utils/encrypter";
import {
  TokenGeneratorContract,
  TokenGeneratorParams,
} from "../../../../../src/features/login/utils/TokenGenerator";
import { TimerContract } from "../../../../../src/features/login/utils/Timer";
import { User } from "../../../../../src/features/login/domain/entities/user";
import { Session } from "../../../../../src/features/login/domain/entities/session";
import { Person } from "../../../../../src/features/login/domain/entities/person";

class MockLoginRepository implements LoginRepositoryContract {
  getUserForLogin: jest.Mock = jest.fn();
  saveSession: jest.Mock = jest.fn();
}

class MockValidator implements ValidatorContract {
  validateEmail: jest.Mock = jest.fn();
  validatePassword: jest.Mock = jest.fn();
}

class MockEncrypter implements EncrypterContract {
  encryptPassword: jest.Mock = jest.fn();
}

class MockTokenGenerator implements TokenGeneratorContract {
  generateJWTToken: jest.Mock = jest.fn();
}

class MockTimer implements TimerContract {
  getTimeNow: jest.Mock = jest.fn();
}

describe("Test DoLogin Use Case", () => {
  var tEmail: string;
  var tPassword: string;
  var tPasswordHash: string;
  var tLoginParams: LoginParams;
  var tUser: User;
  var tTokenGeneratorParams: TokenGeneratorParams;
  var tJWTToken: string;
  var tTimeNow: string;
  var tSession: Session;
  var doLogin: DoLogin;
  var mockLoginRepository: MockLoginRepository;
  var mockValidator: MockValidator;
  var mockEncrypter: MockEncrypter;
  var mockTokenGenerator: MockTokenGenerator;
  var mockTimer: MockTimer;

  beforeEach(() => {
    //Mock values
    tEmail = "valid@email.com";
    tPassword = "password";
    tPasswordHash = "password_hash";
    tLoginParams = new LoginParams(tEmail, tPassword);
    tUser = new User(
      1,
      new Person(1, "person_name", tEmail, "person_phone"),
      tPasswordHash,
      0 // Admin
    );
    tTokenGeneratorParams = new TokenGeneratorParams(
      tUser.idUser,
      tUser.person.email
    );
    tJWTToken = "valid_token";
    tTimeNow = "time_now";
    tSession = new Session(1, tUser, tJWTToken, tTimeNow);
    //Mock Repository
    mockLoginRepository = new MockLoginRepository();
    mockLoginRepository.getUserForLogin.mockResolvedValue(tUser);
    //Mock Validator
    mockValidator = new MockValidator();
    mockValidator.validatePassword.mockResolvedValue(true);
    mockValidator.validateEmail.mockResolvedValue(true);
    //Mock Encrypter
    mockEncrypter = new MockEncrypter();
    mockEncrypter.encryptPassword.mockReturnValue(tPasswordHash);
    //Mock TokenGenerator
    mockTokenGenerator = new MockTokenGenerator();
    mockTokenGenerator.generateJWTToken.mockReturnValue(tJWTToken);
    //Mock TokenGenerator
    mockTimer = new MockTimer();
    mockTimer.getTimeNow.mockReturnValue(tTimeNow);
    //Create sut
    doLogin = new DoLogin(
      mockLoginRepository,
      mockValidator,
      mockEncrypter,
      mockTokenGenerator,
      mockTimer
    );
  });

  describe("Validation", () => {
    it("should call validatePassword from Validator with correct parameters", async () => {
      await doLogin.execute(tLoginParams);

      expect(mockValidator.validatePassword).toHaveBeenCalledWith(tPassword);
      expect(mockValidator.validatePassword).toHaveBeenCalledTimes(1);
    });

    it("should throw InvalidValueError if validatePassword returns false", async () => {
      const tPassword = "invalid_password";
      tLoginParams = new LoginParams(tEmail, tPassword);
      mockValidator.validatePassword.mockReturnValue(false);

      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
        InvalidValueError
      );
      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
        `Invalid value: password`
      );
    });

    it("should call validateEmail from Validator with correct parameters", async () => {
      await doLogin.execute(tLoginParams);

      expect(mockValidator.validateEmail).toHaveBeenCalledWith(tEmail);
      expect(mockValidator.validateEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw InvalidValueError if validateEmail returns false", async () => {
      tEmail = "invalid_password";
      tLoginParams = new LoginParams(tEmail, tEmail);
      mockValidator.validateEmail.mockReturnValue(false);

      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
        InvalidValueError
      );
      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
        `Invalid value: email`
      );
    });
  });

  it("should call getUserForLogin passing correct parameters", async () => {
    //act
    await doLogin.execute(tLoginParams);

    //assert
    expect(mockLoginRepository.getUserForLogin).toHaveBeenCalledWith(tEmail);
    expect(mockLoginRepository.getUserForLogin).toHaveBeenCalledTimes(1);
  });

  describe("If repository throws", () => {
    it("should rethrow UserNotFoundError", async () => {
      tLoginParams = new LoginParams("incorrect@mail.com", "password");
      mockLoginRepository.getUserForLogin.mockImplementation(() => {
        throw new UserNotFoundError();
      });

      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
        UserNotFoundError
      );
    });

    it("should rethrow ConnectionError", async () => {
      mockLoginRepository.getUserForLogin.mockImplementation(() => {
        throw new ConnectionError();
      });

      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
        ConnectionError
      );
    });
  });

  describe("If user is found", () => {
    it("should call encryptPassword from Encrypter with correct parameters", async () => {
      await doLogin.execute(tLoginParams);

      expect(mockEncrypter.encryptPassword).toBeCalledWith(tPassword);
      expect(mockEncrypter.encryptPassword).toHaveBeenCalledTimes(1);
    });

    describe("If password is wrong", () => {
      it("should throw AuthenticationError if User's password is different from encrypted", async () => {
        tPassword = "wrong_password";
        tPasswordHash = "wrong_password_hash";
        tLoginParams = new LoginParams(tEmail, tPassword);
        mockEncrypter.encryptPassword.mockReturnValue(tPasswordHash);

        await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
          AuthenticationError
        );
      });
    });

    describe("If password is correct", () => {
      it("should call generateJWTToken from TokenGenerator passing correct parameters", async () => {
        await doLogin.execute(tLoginParams);

        expect(mockTokenGenerator.generateJWTToken).toBeCalledWith(
          tTokenGeneratorParams
        );
        expect(mockTokenGenerator.generateJWTToken).toBeCalledTimes(1);
      });

      it("should call getTimeNow from Timer", async () => {
        await doLogin.execute(tLoginParams);

        expect(mockTimer.getTimeNow).toBeCalledTimes(1);
      });

      it("should call saveSession from LoginRepository with correct parameters", async () => {
        await doLogin.execute(tLoginParams);

        expect(mockLoginRepository.saveSession).toBeCalledWith(tSession);
        expect(mockLoginRepository.saveSession).toBeCalledTimes(1);
      });

      it("should rethrow ConnectionError if saveSession throws", async () => {
        mockLoginRepository.saveSession.mockImplementation(() => {
          throw new ConnectionError();
        });

        expect(doLogin.execute(tLoginParams)).rejects.toThrow(ConnectionError);
      });

      it("should return a valid Session with empty password", async () => {
        const session: Session = await doLogin.execute(tLoginParams);

        expect(session).toEqual(tSession);
        expect(session.user.password).toBe("");
      });
    });
  });
});
