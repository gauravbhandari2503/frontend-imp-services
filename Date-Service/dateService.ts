import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { enUS } from "date-fns/locale";

export class DateService {
  private static instance: DateService;
  private timeZone: string;

  private constructor() {
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public static getInstance(): DateService {
    if (!DateService.instance) {
      DateService.instance = new DateService();
    }
    return DateService.instance;
  }

  /**
   * Format a date string or Date object.
   * @param date Date object or ISO string
   * @param pattern Format pattern (default: 'yyyy-MM-dd')
   */
  public format(date: Date | string, pattern: string = "yyyy-MM-dd"): string {
    const d = this.parse(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, pattern);
  }

  /**
   * Format a date relative to now (e.g., "5 minutes ago").
   */
  public formatRelative(date: Date | string): string {
    const d = this.parse(date);
    if (!isValid(d)) return "Invalid Date";
    return formatDistanceToNow(d, { addSuffix: true, locale: enUS });
  }

  /**
   * format a date in a specific timezone
   */
  public formatInTimezone(
    date: Date | string,
    pattern: string,
    timeZone: string = this.timeZone,
  ): string {
    const d = this.parse(date);
    if (!isValid(d)) return "Invalid Date";
    return formatInTimeZone(d, timeZone, pattern);
  }

  /**
   * Helper to ensure we have a Date object
   */
  private parse(date: Date | string): Date {
    if (typeof date === "string") {
      return parseISO(date);
    }
    return date;
  }

  public setTimezone(tz: string): void {
    this.timeZone = tz;
  }

  public getTimezone(): string {
    return this.timeZone;
  }
}

export const dateService = DateService.getInstance();
