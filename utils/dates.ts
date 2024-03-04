import moment from 'moment/moment';

export function formatDate(date: Date) {
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function nowWithTimezone() {
  const today = new Date();
  today.setHours(today.getHours() - 3);
  return today;
}

export function todayAtStartOfDayWithTimezone() {
  const firstHourToday = new Date();
  firstHourToday.setHours(-3, 0, 0, 0);
  return firstHourToday;
}

export function atStartOfHoursAgoISO(hours: number) {
  return moment().startOf('hour').subtract(hours, 'hour').toISOString();
}