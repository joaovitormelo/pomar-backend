import { MyModel } from "../../../login/data/models/my_model";
import { Employee } from "../../domain/entities/employee";
import { PersonModel } from "../../../login/data/models/person_model";

export class EmployeeModel extends Employee implements MyModel {
  person: PersonModel;

  constructor(idEmployee: number, person: PersonModel) {
    super(idEmployee, person);
  }

  toJSObject = () => {
    return {
      idEmployee: this.idEmployee,
      person: this.person,
    };
  };

  static fromEntity = (employee: Employee) => {
    return new EmployeeModel(
      employee.idEmployee,
      PersonModel.fromEntity(employee.person)
    );
  };

  static fromDatabase = (employee: any) => {
    return new EmployeeModel(
      employee.id_employee,
      PersonModel.fromDatabase(employee)
    );
  };

  static fromClient = (employee: any) => {
    return new EmployeeModel(
      employee.id_employee,
      PersonModel.fromDatabase(employee.person)
    );
  };
}
