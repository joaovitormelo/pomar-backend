import { Person } from "./person";

export class User {
  idUser: number;
  person: Person;
  password: string;
  typeUser: number;

  constructor(
    idUser: number,
    person: Person,
    password: string,
    typeUser: number
  ) {
    this.idUser = idUser;
    this.person = person;
    this.password = password;
    this.typeUser = typeUser;
  }
}
