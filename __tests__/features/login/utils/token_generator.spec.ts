import {
  TokenGenerator,
  TokenGeneratorParams,
} from "../../../../src/features/login/utils/token_generator";
import { JsonwebtokenWrapper } from "../../../../src/main/wrappers/jsonwebtoken_wrapper";

class MockJsonwebtokenWrapper implements JsonwebtokenWrapper {
  sign: jest.Mock = jest.fn();
}

describe("Test TokenGenerator", () => {
  var tTokenGeneratorParams: TokenGeneratorParams;
  var tJWTToken: string;
  var mockJsonwebtokenWrapper: MockJsonwebtokenWrapper;
  var sut: TokenGenerator;

  beforeEach(() => {
    tJWTToken = "valid_JWTToken";
    tTokenGeneratorParams = new TokenGeneratorParams(1, "user_email");
    mockJsonwebtokenWrapper = new MockJsonwebtokenWrapper();
    mockJsonwebtokenWrapper.sign.mockImplementation((payload, secret, cb) => {
      cb(tJWTToken);
    });
    sut = new TokenGenerator(mockJsonwebtokenWrapper);
  });

  describe("generateJWTToken", () => {
    it("should call sign from JsonwebtokenWrapper with correct params", async () => {
      await sut.generateJWTToken(tTokenGeneratorParams);

      expect(mockJsonwebtokenWrapper.sign.mock.lastCall[0]).toEqual(
        expect.objectContaining({
          idUser: tTokenGeneratorParams.idUser,
          email: tTokenGeneratorParams.email,
        })
      );
      expect(mockJsonwebtokenWrapper.sign.mock.lastCall[2]).toEqual(
        expect.any(Function)
      );
    });

    it("should return ", async () => {
      const JWTToken = await sut.generateJWTToken(tTokenGeneratorParams);

      expect(JWTToken).toBe(tJWTToken);
    });
  });
});
