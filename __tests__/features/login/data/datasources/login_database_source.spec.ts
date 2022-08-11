import { Client } from "pg";
import {
  ConnectionError,
  UserNotFoundError,
} from "../../../../../src/core/errors/errors";
import { LoginDatabaseSource } from "../../../../../src/features/login/data/datasources/login_database_source";
import { PersonModel } from "../../../../../src/features/login/data/models/person_model";
import { SessionModel } from "../../../../../src/features/login/data/models/session_model";
import { UserModel } from "../../../../../src/features/login/data/models/user_model";

class MockClient extends Client {
  query: jest.Mock = jest.fn();
}

describe("Test LoginDatabaseSource", () => {
  var tEmail: string;
  var tUserModel: UserModel;
  var tSessionModel: SessionModel;
  var mockClient: MockClient;
  var sut: LoginDatabaseSource;
  var tUserResult: object;

  beforeEach(() => {
    //Mock values
    tEmail = "valid@email.com";
    tUserModel = new UserModel(
      1,
      new PersonModel(1, "person_name", tEmail, "person_phone"),
      "password",
      0
    );
    tSessionModel = new SessionModel(
      1,
      tUserModel,
      "validJWTToken",
      "time_login"
    );
    tUserResult = {
      rows: [
        {
          id_user: tUserModel.idUser,
          id_person: tUserModel.person.idPerson,
          password: tUserModel.password,
          type_user: tUserModel.typeUser,
          name: tUserModel.person.name,
          email: tUserModel.person.email,
          phone: tUserModel.person.phone,
        },
      ],
    };
    //Mock Sequelize Operation
    mockClient = new MockClient();
    mockClient.query.mockResolvedValue(tUserResult);
    //Create sut
    sut = new LoginDatabaseSource(mockClient);
  });

  describe("getUserForLogin", () => {
    it("should call query from Client with correct parameters", async () => {
      await sut.getUserForLogin(tEmail);

      expect(mockClient.query.mock.lastCall[0]).toEqual(
        "SELECT * FROM client WHERE email = $1"
      );
      expect(mockClient.query.mock.lastCall[1]).toEqual([tEmail]);
      expect(mockClient.query).toHaveBeenCalledTimes(1);
    });

    it("should throw ConnectionError if query throws", async () => {
      mockClient.query.mockImplementation(() => {
        throw new Error();
      });

      await expect(sut.getUserForLogin(tEmail)).rejects.toThrow(
        ConnectionError
      );
    });

    it("should throw UserNotFoundError if query returns result with empty rows array", async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      await expect(sut.getUserForLogin(tEmail)).rejects.toThrow(
        UserNotFoundError
      );
    });

    it("should return correct UserModel", async () => {
      const userModel: UserModel = await sut.getUserForLogin(tEmail);

      expect(userModel).toBeInstanceOf(UserModel);
      expect(userModel.person).toBeInstanceOf(PersonModel);
      expect(userModel.idUser).toEqual(tUserModel.idUser);
      expect(userModel.password).toEqual(tUserModel.password);
      expect(userModel.typeUser).toEqual(tUserModel.typeUser);
      expect(userModel.person.idPerson).toEqual(tUserModel.person.idPerson);
    });
  });

  describe("saveSession", () => {
    it("should call create from Client with correct parameters", async () => {
      await sut.saveSession(tSessionModel);

      expect(mockClient.query.mock.lastCall[0]).toEqual(
        "INSERT INTO session(id_session, jwt_token, login_time, id_user) VALUES ($1, $2, $3, $4)"
      );
      expect(mockClient.query.mock.lastCall[1]).toEqual(
        expect.arrayContaining([
          tSessionModel.idSession,
          tSessionModel.JWTToken,
          tSessionModel.loginTime,
          tSessionModel.user.idUser,
        ])
      );
    });

    it("should rethrow ConnectionError if query throws", async () => {
      mockClient.query.mockImplementation(() => {
        throw new ConnectionError();
      });

      await expect(sut.saveSession(tSessionModel)).rejects.toThrow(
        ConnectionError
      );
    });
  });
});
