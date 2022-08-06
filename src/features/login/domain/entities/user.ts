export class User {
  idUser: number;
  idPerson: number;
  password: string;
  typeUser: number;

  constructor(
    idUser: number,
    idPerson: number,
    password: string,
    typeUser: number
  ) {
    this.idUser = idUser;
    this.idPerson = idPerson;
    this.password = password;
    this.typeUser = typeUser;
  }
}
