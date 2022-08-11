var jwt = require("jsonwebtoken");

export class JsonwebtokenWrapper {
  sign = (payload, secret, callback) => {
    jwt.sign(payload, secret, callback);
  };
}
