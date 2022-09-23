import { ScheduleDatabaseSource } from "../../data/datasources/schedule_database_source";

export class DoReadEvents {
  scheduleDatabaseSource: ScheduleDatabaseSource;

  constructor(scheduleDatabaseSource: ScheduleDatabaseSource) {
    this.scheduleDatabaseSource = scheduleDatabaseSource;
  }

  async execute() {
    return await this.scheduleDatabaseSource.readEvents();
  }
}
