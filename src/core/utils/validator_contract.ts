export interface ValidatorContract {
  validatePassword: (password: string) => boolean;
}
