import { Client } from "pg";
import { Encrypter } from "../../../core/utils/encrypter";
import { DoValidateSession } from "../../login/domain/usecases/do_validate_session";
import { EmployeeDatabaseSource } from "../data/datasources/employee_database_source";
import { EmployeeRepository } from "../data/repositories/employee_repository";
import { DoCreateEmployee } from "../domain/usecases/do_create_employee";
import { DoDeleteEmployee } from "../domain/usecases/do_delete_employee";
import { DoReadEmployees } from "../domain/usecases/do_read_employees";
import { DoUpdateEmployee } from "../domain/usecases/do_update_employee";
import { EmployeeApi } from "./api/employee_api";
import { EmployeeRouter } from "./routers/employee_router";

export class EmployeeInitializer {
  server;
  pgClient: Client;
  doValidateSession: DoValidateSession;
  encrypter: Encrypter;

  constructor(
    server,
    pgClient: Client,
    doValidateSession: DoValidateSession,
    encrypter: Encrypter
  ) {
    this.server = server;
    this.pgClient = pgClient;
    this.doValidateSession = doValidateSession;
    this.encrypter = encrypter;
  }

  init() {
    const employeeDatabaseSource: EmployeeDatabaseSource =
      new EmployeeDatabaseSource(this.pgClient);

    const employeeRepository: EmployeeRepository = new EmployeeRepository(
      employeeDatabaseSource
    );

    const doReadEmployees: DoReadEmployees = new DoReadEmployees(
      employeeRepository
    );
    const doCreateEmployee: DoCreateEmployee = new DoCreateEmployee(
      employeeRepository,
      this.encrypter
    );
    const doUpdateEmployee: DoUpdateEmployee = new DoUpdateEmployee(
      employeeRepository,
      this.encrypter
    );
    const doDeleteEmployee: DoDeleteEmployee = new DoDeleteEmployee(
      employeeRepository
    );

    const employeeRouter: EmployeeRouter = new EmployeeRouter(
      this.doValidateSession,
      doReadEmployees,
      doCreateEmployee,
      doUpdateEmployee,
      doDeleteEmployee
    );

    new EmployeeApi(this.server, employeeRouter).start();
  }
}
