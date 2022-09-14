import { ExpressAdapter } from "../../../../core/adapters/express_adapter";
import { EmployeeRouter } from "../routers/employee_router";
const express = require("express");

export class EmployeeApi {
  server;
  employeeRouter: EmployeeRouter;

  constructor(server, employeeRouter: EmployeeRouter) {
    this.server = server;
    this.employeeRouter = employeeRouter;
  }

  start() {
    const router = express.Router();

    router.get(
      "/employees",
      new ExpressAdapter(this.employeeRouter.readEmployees).adapt
    );

    router.post(
      "/employee",
      new ExpressAdapter(this.employeeRouter.createEmployees).adapt
    );

    this.server.use("/", router);
  }
}
