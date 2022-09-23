export class EventInfoModel {
  idEventInfo: number;
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
  endDate: string;
  times: number;

  constructor(
    idEventInfo: number,
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
    endDate: string,
    times: number
  ) {
    this.idEventInfo = idEventInfo;
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
    this.endDate = endDate;
    this.times = times;
  }

  toJSObject() {
    return {
      id_event_info: this.idEventInfo,
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
      end_date: this.endDate,
      times: this.times,
    };
  }

  static fromDatabase = (eventInfo: any) => {
    return new EventInfoModel(
      eventInfo.id_event_info,
      eventInfo.title,
      eventInfo.init_time,
      eventInfo.end_time,
      eventInfo.all_day,
      eventInfo.description,
      eventInfo.is_task,
      eventInfo.is_collective,
      eventInfo.is_routine,
      eventInfo.init_date,
      eventInfo.frequency,
      eventInfo.interval,
      eventInfo.week_days,
      eventInfo.end_date,
      eventInfo.times
    );
  };

  static fromClient = (eventInfo: any) => {
    return new EventInfoModel(
      eventInfo.id_event_info,
      eventInfo.title,
      eventInfo.init_time,
      eventInfo.end_time,
      eventInfo.all_day,
      eventInfo.description,
      eventInfo.is_task,
      eventInfo.is_collective,
      eventInfo.is_routine,
      eventInfo.init_date,
      eventInfo.frequency,
      eventInfo.interval,
      eventInfo.week_days,
      eventInfo.end_date,
      eventInfo.times
    );
  };
}
