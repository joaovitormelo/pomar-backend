const bcrypt = require("bcrypt");

export interface EncrypterContract {
  encryptPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, passwordHash: string) => Promise<string>;
}

export class Encrypter implements EncrypterContract {
  encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

  comparePassword = async (password: string, passwordHash: string) => {
    return await bcrypt.compare(password, passwordHash);
  };
}
