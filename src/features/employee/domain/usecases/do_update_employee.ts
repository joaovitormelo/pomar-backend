import { ExistentEmailError } from "../../../../core/errors/errors";
import { EncrypterContract } from "../../../../core/utils/encrypter";
import { User } from "../../../login/domain/entities/user";
import { EmployeeRepositoryContract } from "../../data/repositories/employee_repository";
import { Employee } from "../entities/employee";

export class DoUpdateEmployee {
  employeeRepository: EmployeeRepositoryContract;
  encrypter: EncrypterContract;

  constructor(
    employeeRepository: EmployeeRepositoryContract,
    encrypter: EncrypterContract
  ) {
    this.employeeRepository = employeeRepository;
    this.encrypter = encrypter;
  }

  async execute(employee: Employee, user: User) {
    const personWithSameEmailId: number =
      await this.employeeRepository.getPersonIdByEmail(employee.person.email);
    if (personWithSameEmailId) {
      if (employee.person.idPerson != personWithSameEmailId) {
        throw new ExistentEmailError();
      }
    }
    await this.employeeRepository.updatePerson(employee.person);
    user.password = await this.encrypter.encryptPassword(user.password);
    await this.employeeRepository.updateUser(user);
  }
}
