import { User } from "../../../login/domain/entities/user";
import {
  EmployeeRepository,
  EmployeeRepositoryContract,
} from "../../data/repositories/employee_repository";
import { Employee } from "../entities/employee";

export class DoCreateEmployee {
  employeeRepository: EmployeeRepositoryContract;

  constructor(employeeRepository: EmployeeRepositoryContract) {
    this.employeeRepository = employeeRepository;
  }

  execute = async (employee: Employee, user: User) => {
    const idPerson = await this.employeeRepository.createPerson(
      employee.person
    );
    employee.person.idPerson = idPerson;
    user.person.idPerson = idPerson;
    await this.employeeRepository.createEmployee(employee);
    await this.employeeRepository.createUser(user);
  };
}
