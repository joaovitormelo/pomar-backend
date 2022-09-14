import { EmployeeRepositoryContract } from "../../data/repositories/employee_repository";

export class DoReadEmployees {
  employeeRepository: EmployeeRepositoryContract;

  constructor(employeeRepository: EmployeeRepositoryContract) {
    this.employeeRepository = employeeRepository;
  }

  async execute() {
    return await this.employeeRepository.readEmployees();
  }
}
