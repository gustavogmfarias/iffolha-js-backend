import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    compareInHours(startDate: Date, endDate: Date): number {
        const endDateUtc = this.convertToUtc(endDate);
        const startDateUtc = this.convertToUtc(startDate);
        return dayjs(endDateUtc).diff(startDateUtc, "hours");
    }

    convertToUtc(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    dateNow(): Date {
        return dayjs().toDate();
    }

    compareInDays(startDate: Date, endDate: Date): number {
        const endDateUtc = this.convertToUtc(endDate);
        const startDateUtc = this.convertToUtc(startDate);
        return dayjs(endDateUtc).diff(startDateUtc, "days");
    }

    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hour").toDate();
    }

    compareIfBefore(startDate: Date, endDate: Date): boolean {
        return dayjs(startDate).isBefore(endDate);
    }
}

export { DayjsDateProvider };
