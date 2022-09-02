import { Person } from "../../domain/entities/person";
import { MyModel } from "./my_model";

export class PersonModel extends Person implements MyModel {
  toJSObject = () => {
    return {
      id_person: this.idPerson,
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
  };

  static fromEntity = (person: Person) => {
    return new PersonModel(
      person.idPerson,
      person.name,
      person.email,
      person.phone
    );
  };
}
