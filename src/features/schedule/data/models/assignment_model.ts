export class AssignmentModel {
  idAssignment: number;
  idEvent: number;
  idEmployee: number;
  isCompleted: boolean;

  constructor(
    idAssignment: number,
    idEvent: number,
    idEmployee: number,
    isCompleted: boolean
  ) {
    this.idAssignment = idAssignment;
    this.idEvent = idEvent;
    this.idEmployee = idEmployee;
    this.isCompleted = isCompleted;
  }

  toJSObject() {
    return {
      id_assignment: this.idAssignment,
      id_event: this.idEvent,
      id_employee: this.idEmployee,
      is_completed: this.isCompleted,
    };
  }

  static fromDatabase(assignment: any) {
    return new AssignmentModel(
      assignment.id_assignment,
      assignment.id_event,
      assignment.id_employee,
      assignment.is_completed
    );
  }

  static fromClient(assignment: any) {
    return new AssignmentModel(
      assignment.id_assignment,
      assignment.id_event,
      assignment.id_employee,
      assignment.is_completed
    );
  }
}
