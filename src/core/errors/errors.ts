export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}

export class InvalidValueError extends Error {
  value: string;
  constructor(value) {
    super(`Invalid value: ${value}`);
    this.value = value;
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

export class InvalidSessionError extends Error {
  constructor() {
    super(`Invalid session error`);
  }
}

export class NoDataError extends Error {
  constructor() {
    super(`There is no matching data`);
  }
}

export class ExistentEmailError extends Error {
  constructor() {
    super(`There is no matching data`);
  }
}
