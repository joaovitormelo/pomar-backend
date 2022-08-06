export interface TokenGeneratorContract {
  generateJWTToken: (password: string) => string;
}
