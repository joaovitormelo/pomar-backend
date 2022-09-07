import { User } from "../../domain/entities/user";
import { MyModel } from "./my_model";
import { PersonModel } from "./person_model";

export class UserModel extends User implements MyModel {
  person: PersonModel;

  constructor(
    idUser: number,
    person: PersonModel,
    password: string,
    typeUser: number
  ) {
    super(idUser, person, password, typeUser);
  }

  toJSObject = () => {
    return {
      id_user: this.idUser,
      person: this.person.toJSObject(),
      password: this.password,
      type_user: this.typeUser,
    };
  };

  static fromEntity = (user: User) => {
    return new UserModel(
      user.idUser,
      PersonModel.fromEntity(user.person),
      user.password,
      user.typeUser
    );
  };

  static fromDatabase = (user: any) => {
    return new UserModel(
      user.id_user,
      PersonModel.fromDatabase(user),
      user.password,
      user.type_user
    );
  };

  static fromClient = (user: any) => {
    return new UserModel(
      user.id_user,
      PersonModel.fromClient(user.person),
      user.password,
      user.type_user
    );
  };
}
