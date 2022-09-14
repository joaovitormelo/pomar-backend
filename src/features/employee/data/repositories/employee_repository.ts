import { Person } from "../../../login/domain/entities/person";
import { User } from "../../../login/domain/entities/user";
import { Employee } from "../../domain/entities/employee";
import { EmployeeDatabaseSourceContract } from "../datasources/employee_database_source";

export class EmployeeRepositoryContract {
  readEmployees: () => Promise<Array<Employee>>;
  createPerson: (person: Person) => Promise<number>;
  createEmployee: (employee: Employee) => Promise<number>;
  createUser: (user: User) => Promise<number>;
}

export class EmployeeRepository implements EmployeeRepositoryContract {
  employeeDatabaseSourceContract: EmployeeDatabaseSourceContract;

  constructor(employeeDatabaseSourceContract: EmployeeDatabaseSourceContract) {
    this.employeeDatabaseSourceContract = employeeDatabaseSourceContract;
  }

  readEmployees = async () => {
    return await this.employeeDatabaseSourceContract.readEmployees();
  };

  createPerson = async (person: Person) => {
    return await this.employeeDatabaseSourceContract.createPerson(person);
  };

  createEmployee = async (employee: Employee) => {
    return await this.employeeDatabaseSourceContract.createEmployee(employee);
  };

  createUser = async (user: User) => {
    return await this.employeeDatabaseSourceContract.createUser(user);
  };
}
