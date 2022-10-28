export class RoutineExclusionModel {
  idRoutineExclusion: number;
  idEvent: number;
  date: string;

  constructor(idRoutineExclusion: number, idEvent: number, date: string) {
    this.idRoutineExclusion = idRoutineExclusion;
    this.idEvent = idEvent;
    this.date = date;
  }

  toJSObject() {
    return {
      id_routine_exclusion: this.idRoutineExclusion,
      id_event: this.idEvent,
      date: this.date,
    };
  }

  static fromDatabase(RoutineExclusion: any) {
    return new RoutineExclusionModel(
      RoutineExclusion.id_routine_exclusion,
      RoutineExclusion.id_event,
      RoutineExclusion.date
    );
  }

  static fromClient(RoutineExclusion: any) {
    return new RoutineExclusionModel(
      RoutineExclusion.id_event_exclusion,
      RoutineExclusion.id_event,
      RoutineExclusion.date
    );
  }
}
