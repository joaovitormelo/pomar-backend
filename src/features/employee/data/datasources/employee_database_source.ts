import { Client } from "pg";
import { ConnectionError, NoDataError } from "../../../../core/errors/errors";
import { UserModel } from "../../../login/data/models/user_model";
import { Person } from "../../../login/domain/entities/person";
import { User } from "../../../login/domain/entities/user";
import { Employee } from "../../domain/entities/employee";
import { EmployeeModel } from "../models/employee_model";

export class EmployeeDatabaseSourceContract {
  readEmployees: () => Promise<Array<EmployeeModel>>;
  getPersonIdByEmail: (email: string) => Promise<number>;
  createPerson: (person: Person) => Promise<number>;
  createEmployee: (employee: Employee) => Promise<number>;
  createUser: (user: User) => Promise<number>;
  updatePerson: (person: Person) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deletePerson: (idPerson: number) => Promise<void>;
  deleteEmployee: (idEmployee: number) => Promise<EmployeeModel>;
  deleteUser: (idUser: number) => Promise<void>;
  getUserByPersonId: (idPerson: number) => Promise<UserModel>;
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

  getPersonIdByEmail = async (email: string) => {
    try {
      const result = await this.client.query(
        "SELECT * FROM p.person WHERE email = $1",
        [email]
      );
      if (result.rowCount == 0) {
        return null;
      }
      return result.rows[0].id_person;
    } catch (e) {
      console.log(e);
      throw new ConnectionError();
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

  updatePerson = async (person: Person) => {
    console.log(person);
    try {
      const result = await this.client.query(
        "UPDATE p.person SET name=$1, email=$2, phone=$3 WHERE id_person=$4",
        [person.name, person.email, person.phone, person.idPerson]
      );
    } catch (e) {
      console.log(e);
      throw new ConnectionError();
    }
  };

  updateUser = async (user: User) => {
    try {
      const result = await this.client.query(
        "UPDATE p.user SET password=$1 WHERE id_user=$2",
        [user.password, user.idUser]
      );
    } catch (e) {
      console.log(e);
      throw new ConnectionError();
    }
  };

  deletePerson = async (idPerson: number) => {
    try {
      await this.client.query("DELETE FROM p.person WHERE id_person=$1", [
        idPerson,
      ]);
    } catch {
      throw new ConnectionError();
    }
  };

  deleteEmployee = async (idEmployee: number) => {
    try {
      const result = await this.client.query(
        "DELETE FROM p.employee WHERE id_employee=$1 RETURNING *",
        [idEmployee]
      );
      if (result.rowCount == 0) throw new NoDataError();
      return EmployeeModel.fromDatabase(result.rows[0]);
    } catch (e) {
      if (e instanceof NoDataError) throw e;
      throw new ConnectionError();
    }
  };

  deleteUser = async (idUser: number) => {
    try {
      await this.client.query("DELETE FROM p.user WHERE id_user=$1", [idUser]);
    } catch {
      throw new ConnectionError();
    }
  };

  getUserByPersonId = async (idPerson: number) => {
    try {
      const result = await this.client.query(
        "SELECT * FROM p.user WHERE id_person=$1",
        [idPerson]
      );
      if (result.rowCount == 0) throw new NoDataError();
      return UserModel.fromDatabase(result.rows[0]);
    } catch (e) {
      if (e instanceof NoDataError) throw e;
      throw new ConnectionError();
    }
  };
}
