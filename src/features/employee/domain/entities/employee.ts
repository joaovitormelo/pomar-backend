import { Person } from "../../../login/domain/entities/person";

export class Employee {
  idEmployee: number;
  person: Person;

  constructor(idEmployee: number, person: Person) {
    this.idEmployee = idEmployee;
    this.person = person;
  }
}
