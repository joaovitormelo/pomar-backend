import {
  AuthenticationError,
  ConnectionError,
  InvalidValueError,
  UserNotFoundError,
} from "../../../../../src/core/errors/errors";
import { EncrypterContract } from "../../../../../src/core/utils/encrypter";
import { ValidatorContract } from "../../../../../src/core/utils/validator";
import { LoginRepositoryContract } from "../../../../../src/features/login/domain/repositories/login_repository_contract";
import DoLogin, {
  LoginParams,
} from "../../../../../src/features/login/domain/usecases/do_login";
import {
  HttpRequest,
  HttpResponse,
  LoginRouter,
} from "../../../../../src/features/login/presentation/routers/login_router";
import { TimerContract } from "../../../../../src/features/login/utils/timer";
import { TokenGeneratorContract } from "../../../../../src/features/login/utils/token_generator";

class MockValidator implements ValidatorContract {
  validateEmail: jest.Mock = jest.fn();
  validatePassword: jest.Mock = jest.fn();
}

class MockDoLogin implements DoLogin {
  loginRepository: LoginRepositoryContract;
  validator: ValidatorContract;
  encrypter: EncrypterContract;
  tokenGenerator: TokenGeneratorContract;
  timer: TimerContract;
  execute: jest.Mock = jest.fn();
}

describe("Test LoginRouter", () => {
  const tEmail = "valid_email";
  const tPassword = "valid_password";
  const tHttpRequest = new HttpRequest(
    {
      email: "valid_email",
      password: "valid_password",
    },
    {}
  );
  var mockDoLogin: MockDoLogin;
  var mockValidator: MockValidator;
  var sut: LoginRouter;

  beforeEach(() => {
    //Mock DoLogin
    mockDoLogin = new MockDoLogin();
    //Mock Validator
    mockValidator = new MockValidator();
    mockValidator.validatePassword.mockResolvedValue(true);
    mockValidator.validateEmail.mockResolvedValue(true);
    //Create sut
    sut = new LoginRouter(mockValidator, mockDoLogin);
  });

  it("should return status 400 if request has no body", async () => {
    const tHttpRequestWithNoBody = new HttpRequest(null, {});
    const tResponse400 = new HttpResponse(400, {
      code: "001",
      msg: "No body",
    });

    const response: HttpResponse = await sut.login(tHttpRequestWithNoBody);

    expect(response).toEqual(tResponse400);
  });

  it("should return status 400 if request body has no email", async () => {
    const tHttpRequestWithNoEmail = new HttpRequest(
      {
        password: "valid_password",
      },
      {}
    );
    const tResponse400 = new HttpResponse(400, {
      code: "002",
      msg: "Missing parameter",
      target: "email",
    });

    const response: HttpResponse = await sut.login(tHttpRequestWithNoEmail);

    expect(response).toEqual(tResponse400);
  });

  it("should return status 400 if request body has no password", async () => {
    const tHttpRequestWithNoPassword = new HttpRequest(
      {
        email: "valid_email",
      },
      {}
    );
    const tResponse400 = new HttpResponse(400, {
      code: "002",
      msg: "Missing parameter",
      target: "password",
    });

    const response: HttpResponse = await sut.login(tHttpRequestWithNoPassword);

    expect(response).toEqual(tResponse400);
  });

  describe("Validation", () => {
    it("should call validatePassword from Validator with correct parameters", async () => {
      await sut.login(tHttpRequest);

      expect(mockValidator.validatePassword).toHaveBeenCalledWith(tPassword);
      expect(mockValidator.validatePassword).toHaveBeenCalledTimes(1);
    });

    it("should return status 400 if validatePassword returns false", async () => {
      const tHttpRequestWithInvalidPassword = new HttpRequest(
        { email: tEmail, password: "invalid_password" },
        {}
      );
      mockValidator.validatePassword.mockReturnValue(false);
      const tResponse400 = new HttpResponse(400, {
        code: "003",
        msg: "Invalid value",
        target: "password",
      });

      const response: HttpResponse = await sut.login(
        tHttpRequestWithInvalidPassword
      );

      expect(response).toEqual(tResponse400);
    });

    it("should call validateEmail from Validator with correct parameters", async () => {
      await sut.login(tHttpRequest);

      expect(mockValidator.validateEmail).toHaveBeenCalledWith(tEmail);
      expect(mockValidator.validateEmail).toHaveBeenCalledTimes(1);
    });

    it("should return status 400 if validateEmail returns false", async () => {
      const tHttpRequestWithInvalidEmail = new HttpRequest(
        { email: "invalid_email", password: tPassword },
        {}
      );
      mockValidator.validateEmail.mockReturnValue(false);
      const tResponse400 = new HttpResponse(400, {
        code: "003",
        msg: "Invalid value",
        target: "email",
      });

      const response: HttpResponse = await sut.login(
        tHttpRequestWithInvalidEmail
      );

      expect(response).toEqual(tResponse400);
    });
  });

  describe("If DoLogin throws", () => {
    it("should return status 503 if throws ConnectionError", async () => {
      const tResponse503 = new HttpResponse(503, {
        code: "001",
        msg: "No connection to database",
      });
      mockDoLogin.execute.mockImplementation(() => {
        throw new ConnectionError();
      });

      const response: HttpResponse = await sut.login(tHttpRequest);

      expect(response).toEqual(tResponse503);
    });

    it("should return status 404 if throws UserNotFoundError", async () => {
      const tResponse404 = new HttpResponse(404, {
        code: "002",
        msg: "User wasn't found",
      });
      mockDoLogin.execute.mockImplementation(() => {
        throw new UserNotFoundError();
      });

      const response: HttpResponse = await sut.login(tHttpRequest);

      expect(response).toEqual(tResponse404);
    });

    it("should return status 401 if throws AuthenticationError", async () => {
      const tResponse401 = new HttpResponse(401, {
        code: "001",
        msg: "Wrong password",
      });
      mockDoLogin.execute.mockImplementation(() => {
        throw new AuthenticationError();
      });

      const response: HttpResponse = await sut.login(tHttpRequest);

      expect(response).toEqual(tResponse401);
    });

    it("should return status 500 if throws unknown error", async () => {
      const tResponse500 = new HttpResponse(500, {
        msg: "Unknown error in server",
      });
      mockDoLogin.execute.mockImplementation(() => {
        throw new Error();
      });

      const response: HttpResponse = await sut.login(tHttpRequest);

      expect(response).toEqual(tResponse500);
    });
  });
});
