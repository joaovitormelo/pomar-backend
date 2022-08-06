export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}

export class InvalidValueError extends Error {
  constructor(value) {
    super(`Invalid value: ${value}`);
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super(`Authentication error`);
  }
}

export class ConnectionError extends Error {
  constructor() {
    super(`Connection error`);
  }
}
