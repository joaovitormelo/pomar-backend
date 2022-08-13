const bcrypt = require("bcrypt");

export interface EncrypterContract {
  encryptPassword: (password: string) => Promise<string>;
}

export class Encrypter implements EncrypterContract {
  encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
}
