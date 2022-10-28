export class EventModel {
  idEvent: number;
  date: string;
  title: string;
  initTime: string;
  endTime: string;
  allDay: boolean;
  description: string;
  isTask: boolean;
  isCollective: boolean;
  isRoutine: boolean;
  initDate: string;
  frequency: string;
  interval: number;
  weekDays: string;
  undefinedEnd: boolean;
  endDate: string;
  times: number;

  constructor(
    idEvent: number,
    date: string,
    title: string,
    initTime: string,
    endTime: string,
    allDay: boolean,
    description: string,
    isTask: boolean,
    isCollective: boolean,
    isRoutine: boolean,
    initDate: string,
    frequency: string,
    interval: number,
    weekDays: string,
    undefinedEnd: boolean,
    endDate: string,
    times: number
  ) {
    this.idEvent = idEvent;
    this.date = date;
    this.title = title;
    this.initTime = initTime;
    this.endTime = endTime;
    this.allDay = allDay;
    this.description = description;
    this.isTask = isTask;
    this.isCollective = isCollective;
    this.isRoutine = isRoutine;
    this.initDate = initDate;
    this.frequency = frequency;
    this.interval = interval;
    this.weekDays = weekDays;
    this.undefinedEnd = undefinedEnd;
    this.endDate = endDate;
    this.times = times;
  }

  toJSObject() {
    return {
      id_event: this.idEvent,
      date: this.date,
      title: this.title,
      init_time: this.initTime,
      end_time: this.endTime,
      all_day: this.allDay,
      description: this.description,
      is_task: this.isTask,
      is_collective: this.isCollective,
      is_routine: this.isRoutine,
      frequency: this.frequency,
      interval: this.interval,
      week_days: this.weekDays,
      undefined_end: this.undefinedEnd,
      end_date: this.endDate,
      times: this.times,
    };
  }

  static fromDatabase(event: any) {
    return new EventModel(
      event.id_event,
      event.date,
      event.title,
      event.init_time,
      event.end_time,
      event.all_day,
      event.description,
      event.is_task,
      event.is_collective,
      event.is_routine,
      event.init_date,
      event.frequency,
      event.interval,
      event.week_days,
      event.undefined_end,
      event.end_date,
      event.times
    );
  }

  static fromClient(event: any) {
    return new EventModel(
      event.id_event,
      event.date,
      event.title,
      event.init_time,
      event.end_time,
      event.all_day,
      event.description,
      event.is_task,
      event.is_collective,
      event.is_routine,
      event.init_date,
      event.frequency,
      event.interval,
      event.week_days,
      event.undefined_end,
      event.end_date,
      event.times
    );
  }
}
