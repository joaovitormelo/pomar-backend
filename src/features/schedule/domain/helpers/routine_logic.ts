import moment from "moment";
import { EventModel } from "../../data/models/event_model";

export class RoutineLogic {
  static determineIfDailyRoutineExistsInDay(
    event: EventModel,
    day: moment.Moment
  ) {
    const initialDate = moment(event.date);
    const diffDays = day.diff(initialDate, "days");
    if (diffDays > 0) {
      const rest = diffDays % event.interval;
      if (rest == 0) {
        if (event.undefinedEnd) {
          return true;
        } else {
          if (event.endDate) {
            const endDate = moment(event.endDate);
            if (day.diff(endDate, "days") <= 0) {
              return true;
            } else {
              return false;
            }
          } else {
            const timesPassed = diffDays / event.interval + 1;
            if (timesPassed <= event.times) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  static determineIfWeeklyRoutineExistsInDay(
    event: EventModel,
    day: moment.Moment
  ) {
    const initialDate = moment(event.date);
    const diff = day.diff(initialDate, "weeks");
    if (diff > 0) {
      const rest = diff % event.interval;
      if (rest == 0) {
        if (event.undefinedEnd) {
          return true;
        } else {
          if (event.endDate) {
            const endDate = moment(event.endDate);
            if (day.diff(endDate, "weeks") <= 0) {
              return true;
            } else {
              return false;
            }
          } else {
            const timesPassed = diff / event.interval + 1;
            if (timesPassed <= event.times) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  static determineIfMonthlyRoutineExistsInDay(
    event: EventModel,
    day: moment.Moment
  ) {
    const initialDate = moment(event.date);
    const diffDays = day.diff(initialDate, "months");
    if (diffDays > 0) {
      const rest = diffDays % event.interval;
      if (rest == 0) {
        if (event.undefinedEnd) {
          return true;
        } else {
          if (event.endDate) {
            const endDate = moment(event.endDate);
            if (day.diff(endDate, "months") <= 0) {
              return true;
            } else {
              return false;
            }
          } else {
            const timesPassed = diffDays / event.interval + 1;
            if (timesPassed <= event.times) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  static determineIfYearlyRoutineExistsInDay(
    event: EventModel,
    day: moment.Moment
  ) {
    const initialDate = moment(event.date);
    const diffDays = day.diff(initialDate, "years");
    if (diffDays > 0) {
      const rest = diffDays % event.interval;
      if (rest == 0) {
        if (event.undefinedEnd) {
          return true;
        } else {
          if (event.endDate) {
            const endDate = moment(event.endDate);
            if (day.diff(endDate, "years") <= 0) {
              return true;
            } else {
              return false;
            }
          } else {
            const timesPassed = diffDays / event.interval + 1;
            if (timesPassed <= event.times) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
