export class AssignmentModel {
  idAssignment: number;
  idEventInfo: number;
  idEmployee: number;

  constructor(idAssignment: number, idEventInfo: number, idEmployee: number) {
    this.idAssignment = idAssignment;
    this.idEventInfo = idEventInfo;
    this.idEmployee = idEmployee;
  }

  toJSObject() {
    return {
      id_assignment: this.idAssignment,
      id_event_info: this.idEventInfo,
      id_employee: this.idEmployee,
    };
  }

  static fromDatabase(assignment: any) {
    return new AssignmentModel(
      assignment.id_assignment,
      assignment.id_event_info,
      assignment.id_employee
    );
  }

  static fromClient(assignment: any) {
    return new AssignmentModel(
      assignment.id_assignment,
      assignment.id_event_info,
      assignment.id_employee
    );
  }
}
