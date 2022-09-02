const bcrypt = require("bcrypt");
import { Encrypter } from "../../../src/core/utils/encrypter";

jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("Test Encrypter", () => {
  var tPassword: string;
  var tSalt: string;
  var tPasswordHash: string;
  var sut: Encrypter;

  beforeEach(() => {
    tPassword = "valid_password";
    tSalt = "salt";
    tPasswordHash = "valid_password_hash";
    bcrypt.genSalt.mockReset();
    bcrypt.genSalt.mockResolvedValue(tSalt);
    bcrypt.hash.mockReset();
    bcrypt.hash.mockResolvedValue(tPasswordHash);
    bcrypt.compare.mockReset();
    bcrypt.compare.mockResolvedValue(true);
    sut = new Encrypter();
  });

  describe("encryptPassword", () => {
    it("should call genSalt from bcrypt", async () => {
      await sut.encryptPassword(tPassword);

      expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
    });

    it("should call hash from bcrypt with correct parameters", async () => {
      await sut.encryptPassword(tPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(tPassword, tSalt);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    });

    it("should return valid password hash", async () => {
      const pwHash = await sut.encryptPassword(tPassword);

      expect(pwHash).toBe(tPasswordHash);
    });
  });

  describe("comparePassword", () => {
    it("should call compare from bcrypt", async () => {
      await sut.comparePassword(tPassword, tPasswordHash);

      expect(bcrypt.compare).toHaveBeenCalledWith(tPassword, tPasswordHash);
    });

    it("should return correct value", async () => {
      const match = await sut.comparePassword(tPassword, tPasswordHash);

      expect(match).toBe(true);
    });
  });
});
