import { Person } from "../../domain/entities/person";
import { MyModel } from "./my_model";

export class PersonModel extends Person implements MyModel {
  toJSObject = () => {
    return {
      idPerson: this.idPerson,
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
  };
}
