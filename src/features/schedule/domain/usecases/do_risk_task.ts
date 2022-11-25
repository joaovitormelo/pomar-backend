import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";

export class DoSwitchCompleteAssignment {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  execute = async (idAssignment: number, isCompleted: boolean) => {
    await this.scheduleDatabaseSource.switchCompleteAssignment(
      idAssignment,
      isCompleted
    );
  };
}
