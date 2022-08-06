export class User {
  idPerson: number;
  password: string;
  typeUser: number;

  constructor(idPerson: number, password: string, typeUser: number) {
    this.idPerson = idPerson;
    this.password = password;
    this.typeUser = typeUser;
  }
}
