export class UserNotFound extends Error {
  constructor() {
    super("User not found");
  }
}

export class InvalidValue extends Error {
  constructor(value) {
    super(`Invalid value: ${value}`);
  }
}
