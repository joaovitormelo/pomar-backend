import { ExistentEmailError } from "../../../../core/errors/errors";
import { EncrypterContract } from "../../../../core/utils/encrypter";
import { Person } from "../../../login/domain/entities/person";
import { User } from "../../../login/domain/entities/user";
import { EmployeeRepositoryContract } from "../../data/repositories/employee_repository";
import { Employee } from "../entities/employee";

export class DoUpdateEmployeeParams {
  person: Person;

  constructor(person: Person) {
    this.person = person;
  }
}

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

  async execute(params: DoUpdateEmployeeParams) {
    const personWithSameEmailId: number =
      await this.employeeRepository.getPersonIdByEmail(params.person.email);
    if (personWithSameEmailId) {
      if (params.person.idPerson != personWithSameEmailId) {
        throw new ExistentEmailError();
      }
    }
    await this.employeeRepository.updatePerson(params.person);
  }
}
