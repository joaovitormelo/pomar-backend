export class AssignmentStatusModel {
  idAssignmentStatus: number;
  idEvent: number;
  idEmployee: number;
  isCompleted: boolean;

  constructor(
    idAssignmentStatus: number,
    idEvent: number,
    idEmployee: number,
    isCompleted: boolean
  ) {
    this.idAssignmentStatus = idAssignmentStatus;
    this.idEvent = idEvent;
    this.idEmployee = idEmployee;
    this.isCompleted = isCompleted;
  }

  toJSObject() {
    return {
      id_assignment_status: this.idAssignmentStatus,
      id_event: this.idEvent,
      id_employee: this.idEmployee,
      is_completed: this.isCompleted,
    };
  }

  static fromDatabase(assignmentStatus: any) {
    return new AssignmentStatusModel(
      assignmentStatus.id_assignment_status,
      assignmentStatus.id_event,
      assignmentStatus.id_employee,
      assignmentStatus.is_completed
    );
  }

  static fromClient(assignmentStatus: any) {
    return new AssignmentStatusModel(
      assignmentStatus.id_assignment_status,
      assignmentStatus.id_event,
      assignmentStatus.id_employee,
      assignmentStatus.is_completed
    );
  }
}
