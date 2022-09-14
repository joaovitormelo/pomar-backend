import { Client } from "pg";
import { DoValidateSession } from "../../login/domain/usecases/do_validate_session";
import { EmployeeDatabaseSource } from "../data/datasources/employee_database_source";
import { EmployeeRepository } from "../data/repositories/employee_repository";
import { DoCreateEmployee } from "../domain/usecases/do_create_employee";
import { DoReadEmployees } from "../domain/usecases/do_read_employees";
import { EmployeeApi } from "./api/employee_api";
import { EmployeeRouter } from "./routers/employee_router";

export class EmployeeInitializer {
  server;
  pgClient: Client;
  doValidateSession: DoValidateSession;

  constructor(server, pgClient: Client, doValidateSession: DoValidateSession) {
    this.server = server;
    this.pgClient = pgClient;
    this.doValidateSession = doValidateSession;
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
      employeeRepository
    );

    const employeeRouter: EmployeeRouter = new EmployeeRouter(
      this.doValidateSession,
      doReadEmployees,
      doCreateEmployee
    );

    new EmployeeApi(this.server, employeeRouter).start();
  }
}
