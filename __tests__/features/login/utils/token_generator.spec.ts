import {
  TokenGenerator,
  TokenGeneratorParams,
} from "../../../../src/features/login/utils/token_generator";
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Test TokenGenerator", () => {
  var tTokenGeneratorParams: TokenGeneratorParams;
  var tJWTToken: string;
  var sut: TokenGenerator;

  beforeEach(() => {
    tJWTToken = "valid_JWTToken";
    tTokenGeneratorParams = new TokenGeneratorParams(1, "user_email");
    jwt.sign.mockReset();
    jwt.sign.mockImplementation((payload, secret, cb) => {
      cb(null, tJWTToken);
    });
    sut = new TokenGenerator();
  });

  describe("generateJWTToken", () => {
    it("should call sign from JsonwebtokenWrapper with correct params", async () => {
      await sut.generateJWTToken(tTokenGeneratorParams);

      expect(jwt.sign.mock.lastCall[0]).toEqual(
        expect.objectContaining({
          idUser: tTokenGeneratorParams.idUser,
          email: tTokenGeneratorParams.email,
        })
      );
      expect(jwt.sign.mock.lastCall[2]).toEqual(expect.any(Function));
    });

    it("should return correct JWTToken", async () => {
      const JWTToken = await sut.generateJWTToken(tTokenGeneratorParams);

      expect(JWTToken).toBe(tJWTToken);
    });
  });
});
