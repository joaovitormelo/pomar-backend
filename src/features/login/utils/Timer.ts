import moment from "moment";

export interface TimerContract {
  getTimeNow: () => string;
}

export default class Timer implements TimerContract {
  getTimeNow(): string {
    return moment().format();
  }
}
