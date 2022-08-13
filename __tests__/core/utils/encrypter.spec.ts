const bcrypt = require("bcrypt");
import { Encrypter } from "../../../src/core/utils/encrypter";

jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
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
    sut = new Encrypter();
  });

  it("should call genSalt from Bcrypt", async () => {
    await sut.encryptPassword(tPassword);

    expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
  });

  it("should call hash from Bcrypt with correct parameters", async () => {
    await sut.encryptPassword(tPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(tPassword, tSalt);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
  });

  it("should return valid password hash", async () => {
    const pwHash = await sut.encryptPassword(tPassword);

    expect(pwHash).toBe(tPasswordHash);
  });
});
