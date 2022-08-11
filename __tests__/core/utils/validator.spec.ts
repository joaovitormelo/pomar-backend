import { InvalidValueError } from "../../../src/core/errors/errors";
import { Validator } from "../../../src/core/utils/validator";

describe("Test Validator", () => {
  var sut = new Validator();

  describe("validateEmail", () => {
    it("should return false if value is not string", async () => {
      const tWrongEmail = 0;

      const isValid = sut.validateEmail(tWrongEmail);

      expect(isValid).toBe(false);
    });

    it("should return false if value has more than 320 characters", () => {
      const tBigEmail =
        "big@xa6UVfuFggulIWtbzV2j3CFIcQG6EdKW3EKpxArYi3NlP8vu4Rr5VMDmiIOaCaGts5j9qV7xI6LWBPyFjTjKHsx1O0YkDXSQVGJmfElV2l73WNnM9VLzUYTF6M1DIEzU1XQEHjpHddvwLrWt57k2zWeJC4SkfKbTFdM0oivmdM1M5O1prEnqrOjSxOZhQldt4K18A6t0aECilPCSxHsfyLXYhFD1L8K5brnEPy0Iy6V8InsBmauDOASJ1tI5TmZL4fujM1fHGw8ftBhFWX2HItgoSziFeKCA3cfqniYBWrDiMzKGf77F2ME0q.com";

      const isValid = sut.validateEmail(tBigEmail);

      expect(isValid).toBe(false);
    });

    it("should return false if email does not match email Regex", () => {
      const tInvalidEmail = "invalid_email";

      const isValid = sut.validateEmail(tInvalidEmail);

      expect(isValid).toBe(false);
    });

    it("should return true if email is valid", () => {
      var tValidEmail = "valid@mail.com";

      const isValid = sut.validateEmail(tValidEmail);

      expect(isValid).toBe(true);
    });
  });

  describe("validatePassword", () => {
    it("should return false if value is not string", async () => {
      const tWrongPw = 0;

      const isValid = sut.validatePassword(tWrongPw);

      expect(isValid).toBe(false);
    });

    it("should return false if value has more than 45 characters", () => {
      const tBigPw = "13scUCsRbO5hNJ7BlRrbhkjZVtAuAyHqCBpcT531SoWcwf";

      const isValid = sut.validatePassword(tBigPw);

      expect(isValid).toBe(false);
    });

    it("should return false if value does not match password Regex", () => {
      const tInvalidPw = "invalid_pw";

      const isValid = sut.validatePassword(tInvalidPw);

      expect(isValid).toBe(false);
    });

    it("should return true if value is valid", () => {
      var tValidPw = "validPassword1";

      const isValid = sut.validatePassword(tValidPw);

      expect(isValid).toBe(true);
    });
  });
});
