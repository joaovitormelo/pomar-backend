const moment = require("moment-timezone");
moment.tz.setDefault("America/Sao_Paulo");

export interface TimerContract {
  getTimeNow: () => string;
}

export default class Timer implements TimerContract {
  getTimeNow(): string {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
