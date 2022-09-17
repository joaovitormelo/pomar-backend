import { ExistentEmailError } from "../../../../core/errors/errors";
import { EncrypterContract } from "../../../../core/utils/encrypter";
import { User } from "../../../login/domain/entities/user";
import { EmployeeRepositoryContract } from "../../data/repositories/employee_repository";
import { Employee } from "../entities/employee";

export class DoCreateEmployee {
  employeeRepository: EmployeeRepositoryContract;
  encrypter: EncrypterContract;

  constructor(
    employeeRepository: EmployeeRepositoryContract,
    encrypter: EncrypterContract
  ) {
    this.employeeRepository = employeeRepository;
    this.encrypter = encrypter;
  }

  execute = async (employee: Employee, user: User) => {
    const existentEmail = await this.employeeRepository.getPersonIdByEmail(
      employee.person.email
    );
    if (existentEmail) {
      throw new ExistentEmailError();
    } else {
      const idPerson = await this.employeeRepository.createPerson(
        employee.person
      );
      employee.person.idPerson = idPerson;
      user.person.idPerson = idPerson;
      user.password = await this.encrypter.encryptPassword(user.password);
      await this.employeeRepository.createEmployee(employee);
      await this.employeeRepository.createUser(user);
    }
  };
}
