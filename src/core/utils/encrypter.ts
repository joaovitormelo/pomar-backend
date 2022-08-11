export interface EncrypterContract {
  encryptPassword: (password: string) => Promise<string>;
}

export class Encrypter implements EncrypterContract {
  bCrypt;

  constructor(bCrypt) {
    this.bCrypt = bCrypt;
  }

  encryptPassword = async (password: string) => {
    const salt = await this.bCrypt.genSalt(10);
    return await this.bCrypt.hash(password, salt);
  };
}
