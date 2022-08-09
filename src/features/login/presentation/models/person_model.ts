import { Person } from "../../domain/entities/person";

export class PersonModel implements Person {
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

  toJSObject = () => {
    return { ...this };
  };
}
