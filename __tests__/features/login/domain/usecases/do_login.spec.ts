import { User } from "../../../../../src/features/login/domain/entities/user";
import { LoginRepositoryContract } from "../../../../../src/features/login/domain/repositories/login_repository_contract";
import DoLogin, {
  LoginParams,
} from "../../../../../src/features/login/domain/usecases/do_login";
import { On, method } from "ts-auto-mock/extension";
import { createMock } from "ts-auto-mock";
import {
  InvalidValue,
  UserNotFound,
} from "../../../../../src/core/errors/errors";
import { ValidatorContract } from "../../../../../src/core/utils/validator_contract";

describe("Test DoLogin Use Case", () => {
  var tEmail;
  var tPassword;
  var tLoginParams;
  var tUser;
  var doLogin: DoLogin;
  var mockLoginRepository;
  var mockGetUserForLogin: jest.Mock;
  var mockValidator;
  var mockValidatePassword: jest.Mock;

  beforeEach(() => {
    //Mock values
    tEmail = "e@mail.com";
    tPassword = "password";
    tLoginParams = new LoginParams(tEmail, tPassword);
    tUser = new User(1, "password_hash", 0);
    //Mock Repository
    mockLoginRepository = createMock<LoginRepositoryContract>();
    mockGetUserForLogin = On(mockLoginRepository).get(
      (mockLoginRepository) => mockLoginRepository.getUserForLogin
    );
    mockGetUserForLogin.mockResolvedValue(tUser);
    //Mock Validator
    mockValidator = createMock<ValidatorContract>();
    mockValidatePassword = On(mockValidator).get(
      (mockValidator) => mockValidator.validatePassword
    );
    mockValidatePassword.mockResolvedValue(true);
    //Create sut
    doLogin = new DoLogin(mockLoginRepository, mockValidator);
  });

  describe("Validation", () => {
    it("should call validatePassword from Validator with correct parameters", () => {});

    it("should rethrow InvalidValue if validatePassword throws it", async () => {
      const tInvalidPassword = "invalid_password";
      tLoginParams = new LoginParams(tEmail, tInvalidPassword);
      mockValidatePassword.mockImplementation(() => {
        throw new InvalidValue("password");
      });

      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(InvalidValue);
      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(
        `Invalid value: password`
      );
    });

    it("should call validateEmail from Validator with correct parameters", () => {});

    it("should throw InvalidValue if email is invalid", () => {});
  });

  it("should call getUserForLogin passing correct parameters", async () => {
    //act
    await doLogin.execute(tLoginParams);

    //assert
    expect(mockGetUserForLogin).toHaveBeenCalledWith(tEmail);
    expect(mockGetUserForLogin).toHaveBeenCalledTimes(1);
  });

  describe("If repository throws UserNotFound", () => {
    it("should throw UserNotFound", async () => {
      tLoginParams = new LoginParams("incorrect@mail.com", "password");
      mockGetUserForLogin.mockImplementation(() => {
        throw new UserNotFound();
      });

      await expect(doLogin.execute(tLoginParams)).rejects.toThrow(UserNotFound);
    });
  });

  describe("If user is found", () => {
    it("should call encryptPassword from Encrypter with correct parameters", () => {});

    describe("If password is wrong", () => {
      it("should throw AuthenticationError if User's password is different from encrypted", () => {});
    });

    describe("If password is correct", () => {
      it("should call generateJWTToken from TokenGenerator", () => {});

      it("should return a valid LoginReturn with User and token", () => {});
    });
  });
});
