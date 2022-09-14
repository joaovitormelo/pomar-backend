import { Client } from "pg";
import { ConnectionError, NoDataError } from "../../../../core/errors/errors";
import { Person } from "../../../login/domain/entities/person";
import { User } from "../../../login/domain/entities/user";
import { Employee } from "../../domain/entities/employee";
import { EmployeeModel } from "../models/employee_model";

export class EmployeeDatabaseSourceContract {
  readEmployees: () => Promise<Array<EmployeeModel>>;
  createPerson: (person: Person) => Promise<number>;
  createEmployee: (employee: Employee) => Promise<number>;
  createUser: (user: User) => Promise<number>;
}

export class EmployeeDatabaseSource implements EmployeeDatabaseSourceContract {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  readEmployees = async () => {
    try {
      const result = await this.client.query(
        "SELECT * FROM p.employee e INNER JOIN p.person pe ON e.id_person = pe.id_person"
      );
      if (result.rowCount == 0) throw new NoDataError();
      return result.rows.map((employee) =>
        EmployeeModel.fromDatabase(employee)
      );
    } catch (e) {
      if (e instanceof NoDataError) throw e;
      else throw new ConnectionError();
    }
  };

  createPerson = async (person: Person) => {
    try {
      const result = await this.client.query(
        "INSERT INTO p.person(name, email, phone) VALUES ($1, $2, $3) RETURNING id_person",
        [person.name, person.email, person.phone]
      );
      return result.rows[0].id_person;
    } catch (e) {
      console.log(e);
      throw new ConnectionError();
    }
  };

  createEmployee = async (employee: Employee) => {
    try {
      const result = await this.client.query(
        "INSERT INTO p.employee(id_person) VALUES ($1) RETURNING id_employee",
        [employee.person.idPerson]
      );
      return result.rows[0].id_employee;
    } catch (e) {
      throw new ConnectionError();
    }
  };

  createUser = async (user: User) => {
    try {
      const result = await this.client.query(
        "INSERT INTO p.user(id_person, password, type_user) VALUES ($1, $2, $3) RETURNING id_user",
        [user.person.idPerson, user.password, user.typeUser]
      );
      return result.rows[0].id_employee;
    } catch (e) {
      throw new ConnectionError();
    }
  };
}
