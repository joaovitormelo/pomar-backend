import { InvalidValueError } from "../errors/errors";

const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//Mínimo 8 caracteres, uma letra maiúscula e um número
const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

export interface ValidatorContract {
  validateEmail: (email) => boolean;
  validatePassword: (password) => boolean;
}

export class Validator implements ValidatorContract {
  validateEmail = (email) => {
    if (typeof email != "string") {
      return false;
    } else if (email.length > 320) {
      return false;
    } else if (!email.match(emailRegEx)) {
      return false;
    }
    return true;
  };
  validatePassword = (password) => {
    if (typeof password !== "string") {
      return false;
    } else if (password.length > 45) {
      return false;
    } else if (!password.match(passwordRegEx)) {
      return false;
    }
    return true;
  };
}
