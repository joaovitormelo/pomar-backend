import { Person } from "../../../login/domain/entities/person";
import { User } from "../../../login/domain/entities/user";
import { Employee } from "../../domain/entities/employee";
import { EmployeeDatabaseSourceContract } from "../datasources/employee_database_source";

export class EmployeeRepositoryContract {
  readEmployees: () => Promise<Array<Employee>>;
  getPersonIdByEmail: (email: string) => Promise<number>;
  createPerson: (person: Person) => Promise<number>;
  createEmployee: (employee: Employee) => Promise<number>;
  createUser: (user: User) => Promise<number>;
  updatePerson: (employee: Person) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deletePerson: (idPerson: number) => Promise<void>;
  deleteEmployee: (idEmployee: number) => Promise<Employee>;
  deleteUser: (idUser: number) => Promise<void>;
  getUserByPersonId: (idPerson: number) => Promise<User>;
}

export class EmployeeRepository implements EmployeeRepositoryContract {
  employeeDatabaseSource: EmployeeDatabaseSourceContract;

  constructor(employeeDatabaseSource: EmployeeDatabaseSourceContract) {
    this.employeeDatabaseSource = employeeDatabaseSource;
  }

  readEmployees = async () => {
    return await this.employeeDatabaseSource.readEmployees();
  };

  getPersonIdByEmail = async (email: string) => {
    return await this.employeeDatabaseSource.getPersonIdByEmail(email);
  };

  createPerson = async (person: Person) => {
    return await this.employeeDatabaseSource.createPerson(person);
  };

  createEmployee = async (employee: Employee) => {
    return await this.employeeDatabaseSource.createEmployee(employee);
  };

  createUser = async (user: User) => {
    return await this.employeeDatabaseSource.createUser(user);
  };

  updatePerson = async (person: Person) => {
    await this.employeeDatabaseSource.updatePerson(person);
  };

  updateUser = async (user: User) => {
    await this.employeeDatabaseSource.updateUser(user);
  };

  deletePerson = async (idPerson: number) => {
    return await this.employeeDatabaseSource.deletePerson(idPerson);
  };

  deleteEmployee = async (idEmployee: number) => {
    return await this.employeeDatabaseSource.deleteEmployee(idEmployee);
  };

  deleteUser = async (idUser: number) => {
    return await this.employeeDatabaseSource.deleteUser(idUser);
  };

  getUserByPersonId = async (idPerson: number) => {
    return await this.employeeDatabaseSource.getUserByPersonId(idPerson);
  };
}
