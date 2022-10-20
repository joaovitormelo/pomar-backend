import { ErrorMessages } from "../../../../core/errors/error_messages";
import { HttpRequest } from "../../../../core/presentation/routers/http_request";
import { HttpResponse } from "../../../../core/presentation/routers/http_response";
import { SecuredRouter } from "../../../../core/presentation/routers/secured_router";
import { ValidateBody } from "../../../../core/presentation/routers/validate_body";
import { PersonModel } from "../../../login/data/models/person_model";
import { UserModel } from "../../../login/data/models/user_model";
import { Person } from "../../../login/domain/entities/person";
import { User } from "../../../login/domain/entities/user";
import { DoValidateSession } from "../../../login/domain/usecases/do_validate_session";
import { EmployeeModel } from "../../data/models/employee_model";
import { Employee } from "../../domain/entities/employee";
import { DoCreateEmployee } from "../../domain/usecases/do_create_employee";
import { DoDeleteEmployee } from "../../domain/usecases/do_delete_employee";
import { DoReadEmployees } from "../../domain/usecases/do_read_employees";
import {
  DoUpdateEmployee,
  DoUpdateEmployeeParams,
} from "../../domain/usecases/do_update_employee";

export class EmployeeRouter extends SecuredRouter {
  doReadEmployees: DoReadEmployees;
  doCreateEmployee: DoCreateEmployee;
  doUpdateEmployee: DoUpdateEmployee;
  doDeleteEmployee: DoDeleteEmployee;

  constructor(
    doValidateSession: DoValidateSession,
    doReadEmployees: DoReadEmployees,
    doCreateEmployee: DoCreateEmployee,
    doUpdateEmployee: DoUpdateEmployee,
    doDeleteEmployee: DoDeleteEmployee
  ) {
    super(doValidateSession);
    this.doReadEmployees = doReadEmployees;
    this.doCreateEmployee = doCreateEmployee;
    this.doUpdateEmployee = doUpdateEmployee;
    this.doDeleteEmployee = doDeleteEmployee;
  }

  readEmployees = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      try {
        const listEmployee: Array<Employee> =
          await this.doReadEmployees.execute();
        const listEmployeeJson: Array<any> = listEmployee.map(
          (employee: Employee) =>
            EmployeeModel.fromEntity(employee).toJSObject()
        );
        return new HttpResponse(200, listEmployeeJson);
      } catch (e) {
        return ErrorMessages.mapErrorToHttpResponse(e);
      }
    });
  };

  createEmployees = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(
        httpRequest,
        ["employee", "user"],
        async () => {
          var employee: Employee;
          var user: User;
          try {
            employee = EmployeeModel.fromClient(httpRequest.body.employee);
          } catch {
            return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
              code: ErrorMessages.infoInvalidValue.code,
              msg: ErrorMessages.infoInvalidValue.msg,
              target: "employee",
            });
          }
          try {
            user = UserModel.fromClient(httpRequest.body.user);
          } catch {
            return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
              code: ErrorMessages.infoInvalidValue.code,
              msg: ErrorMessages.infoInvalidValue.msg,
              target: "user",
            });
          }
          try {
            await this.doCreateEmployee.execute(employee, user);
            return new HttpResponse(200);
          } catch (e) {
            return ErrorMessages.mapErrorToHttpResponse(e);
          }
        }
      );
    });
  };

  updateEmployee = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      return await ValidateBody.validate(httpRequest, ["person"], async () => {
        var person: Person;
        try {
          person = PersonModel.fromClient(httpRequest.body.person);
        } catch {
          return new HttpResponse(ErrorMessages.infoInvalidValue.status, {
            code: ErrorMessages.infoInvalidValue.code,
            msg: ErrorMessages.infoInvalidValue.msg,
            target: "person",
          });
        }
        try {
          await this.doUpdateEmployee.execute(
            new DoUpdateEmployeeParams(person)
          );
          return new HttpResponse(200);
        } catch (e) {
          return ErrorMessages.mapErrorToHttpResponse(e);
        }
      });
    });
  };

  deleteEmployee = async (httpRequest: HttpRequest) => {
    return await this.validateToken(httpRequest, async () => {
      if (!httpRequest.params.idEmployee) {
        return new HttpResponse(ErrorMessages.infoMissingParameter.status, {
          code: ErrorMessages.infoMissingParameter.code,
          msg: ErrorMessages.infoMissingParameter.msg,
        });
      }
      try {
        await this.doDeleteEmployee.execute(httpRequest.params.idEmployee);
        return new HttpResponse(200);
      } catch (e) {
        return ErrorMessages.mapErrorToHttpResponse(e);
      }
    });
  };
}
