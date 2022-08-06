export interface ValidatorContract {
  validatePassword: (password: string) => boolean;
  validateEmail: (email: string) => boolean;
}
