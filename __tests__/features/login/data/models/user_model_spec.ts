import { PersonModel } from "../../../../../src/features/login/data/models/person_model";
import { UserModel } from "../../../../../src/features/login/data/models/user_model";

describe("Test User model", () => {
  describe("fromJSObject", () => {
    it("should return valid User model from JS object", () => {
      const tUserModel = new UserModel(
        1,
        new PersonModel(1, "name_person", "email_person", "phone_person"),
        "password_user",
        0
      );
      const tJSObject = {
        id_user: 1,
        password: "password_user",
        type_user: 0,
        id_person: 1,
        name: "name_person",
        email: "email_person",
        phone: "phone_person",
      };

      const userModel: UserModel = UserModel.fromJsObject(tJSObject);

      expect(userModel).toBeInstanceOf(UserModel);
      expect(userModel.person).toBeInstanceOf(PersonModel);
      expect(userModel.idUser).toEqual(tUserModel.idUser);
      expect(userModel.password).toEqual(tUserModel.password);
      expect(userModel.typeUser).toEqual(tUserModel.typeUser);
    });
  });
});
