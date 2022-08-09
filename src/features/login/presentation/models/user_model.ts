import { Person } from "../../domain/entities/person";
import { User } from "../../domain/entities/user";
import { PersonModel } from "./person_model";

export class UserModel implements User {
  idUser: number;
  person: PersonModel;
  password: string;
  typeUser: number;

  constructor(
    idUser: number,
    person: PersonModel,
    password: string,
    typeUser: number
  ) {
    this.idUser = idUser;
    this.person = person;
    this.password = password;
    this.typeUser = typeUser;
  }
  toJSObject = () => {
    return {
      idUser: this.idUser,
      person: this.person.toJSObject(),
      password: this.password,
      typeUser: this.typeUser,
    };
  };
}
