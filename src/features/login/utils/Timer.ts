import moment from "moment";

export class Timer {
  getTimeNow(): string {
    return moment().format();
  }
}
