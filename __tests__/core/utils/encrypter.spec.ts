import { Encrypter } from "../../../src/core/utils/encrypter";

class MockBcrypt {
  genSalt: jest.Mock = jest.fn();
  hash: jest.Mock = jest.fn();
}

describe("Test Encrypter", () => {
  var tPassword: string;
  var tSalt: string;
  var tPasswordHash: string;
  var mockBcrypt: MockBcrypt;
  var sut: Encrypter;

  beforeEach(() => {
    tPassword = "valid_password";
    tSalt = "salt";
    tPasswordHash = "valid_password_hash";
    mockBcrypt = new MockBcrypt();
    mockBcrypt.genSalt.mockResolvedValue(tSalt);
    mockBcrypt.hash.mockResolvedValue(tPasswordHash);
    sut = new Encrypter(mockBcrypt);
  });

  it("should call genSalt from Bcrypt", async () => {
    await sut.encryptPassword(tPassword);

    expect(mockBcrypt.genSalt).toHaveBeenCalledTimes(1);
  });

  it("should call hash from Bcrypt with correct parameters", async () => {
    await sut.encryptPassword(tPassword);

    expect(mockBcrypt.hash).toHaveBeenCalledWith(tPassword, tSalt);
    expect(mockBcrypt.hash).toHaveBeenCalledTimes(1);
  });

  it("should return valid password hash", async () => {
    const pwHash = await sut.encryptPassword(tPassword);

    expect(pwHash).toBe(tPasswordHash);
  });
});
