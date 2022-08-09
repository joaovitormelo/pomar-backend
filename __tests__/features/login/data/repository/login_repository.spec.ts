import {
  ConnectionError,
  UserNotFoundError,
} from "../../../../../src/core/errors/errors";
import { LoginDatabaseSourceContract } from "../../../../../src/features/login/data/datasources/login_database_source";
import { LoginRepository } from "../../../../../src/features/login/data/repositories/login_repository";
import { Session } from "../../../../../src/features/login/domain/entities/session";
import { PersonModel } from "../../../../../src/features/login/presentation/models/person_model";
import { UserModel } from "../../../../../src/features/login/presentation/models/user_model";

class MockLoginDatabaseSource implements LoginDatabaseSourceContract {
  getUserForLogin: jest.Mock = jest.fn();
  saveSession: jest.Mock = jest.fn();
}

describe("Test LoginRepository", () => {
  var tEmail: string;
  var tUserModel: UserModel;
  var tSession: Session;
  var mockLoginDatabaseSource: MockLoginDatabaseSource;
  var loginRepository: LoginRepository;

  beforeEach(() => {
    //Mock values
    tEmail = "valid@mail.com";
    tUserModel = new UserModel(
      1,
      new PersonModel(1, "person_name", tEmail, "person_phone"),
      "password_hash",
      0 // Admin
    );
    tSession = new Session(tUserModel, "valid_token", "time_now");
    //Mock LoginDatabaseSource
    mockLoginDatabaseSource = new MockLoginDatabaseSource();
    mockLoginDatabaseSource.getUserForLogin.mockResolvedValue(tUserModel);
    //Create Sut
    loginRepository = new LoginRepository(mockLoginDatabaseSource);
  });

  describe("getUserForLogin", () => {
    it("should call getUserForLogin from LoginDatabaseSource with correct parameters", async () => {
      await loginRepository.getUserForLogin(tEmail);

      expect(mockLoginDatabaseSource.getUserForLogin).toHaveBeenCalledWith(
        tEmail
      );
      expect(mockLoginDatabaseSource.getUserForLogin).toHaveBeenCalledTimes(1);
    });

    it("should rethrow UserNotFoundError if LoginDatabaseSource throws", async () => {
      mockLoginDatabaseSource.getUserForLogin.mockImplementation(() => {
        throw new UserNotFoundError();
      });

      await expect(loginRepository.getUserForLogin(tEmail)).rejects.toThrow(
        UserNotFoundError
      );
    });

    it("should rethrow ConnectionError if LoginDatabaseSource throws", async () => {
      mockLoginDatabaseSource.getUserForLogin.mockImplementation(() => {
        throw new ConnectionError();
      });

      await expect(loginRepository.getUserForLogin(tEmail)).rejects.toThrow(
        ConnectionError
      );
    });

    it("should return correct User", async () => {
      const userModel: UserModel = await loginRepository.getUserForLogin(
        tEmail
      );

      expect(userModel).toEqual(tUserModel);
    });
  });

  describe("saveSession", () => {
    it("should call saveSession from LoginDatabaseSource with correct parameters", async () => {
      await loginRepository.saveSession(tSession);

      expect(mockLoginDatabaseSource.saveSession).toHaveBeenCalledWith(
        tSession
      );
      expect(mockLoginDatabaseSource.saveSession).toHaveBeenCalledTimes(1);
    });

    it("should rethrow ConnectionError if LoginDatabaseSource throws", async () => {
      mockLoginDatabaseSource.saveSession.mockImplementation(() => {
        throw new ConnectionError();
      });

      await expect(loginRepository.saveSession(tSession)).rejects.toThrow(
        ConnectionError
      );
    });
  });
});
