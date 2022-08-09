export class Person {
  idPerson: number;
  name: string;
  email: string;
  phone: string;

  constructor(idPerson: number, name: string, email: string, phone: string) {
    this.idPerson = idPerson;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}
