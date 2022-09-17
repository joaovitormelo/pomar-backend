import { User } from "../../../login/domain/entities/user";
import { EmployeeRepositoryContract } from "../../data/repositories/employee_repository";
import { Employee } from "../entities/employee";

export class DoDeleteEmployee {
  employeeRepository: EmployeeRepositoryContract;

  constructor(employeeRepository: EmployeeRepositoryContract) {
    this.employeeRepository = employeeRepository;
  }

  async execute(idEmployee: number) {
    const employee: Employee = await this.employeeRepository.deleteEmployee(
      idEmployee
    );
    const user: User = await this.employeeRepository.getUserByPersonId(
      employee.person.idPerson
    );
    await this.employeeRepository.deleteUser(user.idUser);
    await this.employeeRepository.deletePerson(employee.person.idPerson);
  }
}
