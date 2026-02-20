function relative(dateTime: string | undefined, culture: string) {
  if (!dateTime) {
    return '';
  }
  const date = Date.parse(dateTime);
  if (!date) {
    return '';
  }
  const now = Date.now();
  const secondsDifference = (date - now) / 1000;
  const secondsDifferenceAbs = Math.abs(secondsDifference);

  // show as seconds relative
  if (secondsDifferenceAbs < 60) {
    return new Intl.RelativeTimeFormat(culture, { style: 'short' }).format(
      Math.round(secondsDifference / 10) * 10,
      'second'
    );
  }
  // show as minutes relative
  if (secondsDifferenceAbs < 3600) {
    return new Intl.RelativeTimeFormat(culture, { style: 'short' }).format(
      Math.round(secondsDifference / 60),
      'minute'
    );
  }

  const nowDate = new Date(now);
  const formattedDate = new Date(date);
  // show just time
  if (
    nowDate.getFullYear() === formattedDate.getFullYear() &&
    nowDate.getMonth() === formattedDate.getMonth() &&
    nowDate.getDay() === formattedDate.getDay()
  ) {
    return new Intl.DateTimeFormat(culture, {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }

  // show just date and time
  if (nowDate.getFullYear() === formattedDate.getFullYear()) {
    return new Intl.DateTimeFormat(culture, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }

  const isLessThanMonth = secondsDifferenceAbs < 30 * 24 * 60 * 60;

  // show full date, time and year
  return new Intl.DateTimeFormat(culture, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: isLessThanMonth ? 'numeric' : undefined,
    minute: isLessThanMonth ? 'numeric' : undefined,
  }).format(date);
}

function getRelativeRefresh(dateTime: string | undefined): number {
  // For refresh to work well with DateView, value must change after this interval. Else no new refresh will happen

  if (!dateTime) {
    return 0;
  }
  const date = Date.parse(dateTime);
  if (!date) {
    return 0;
  }
  const now = Date.now();
  const secondsDifference = (date - now) / 1000;
  const secondsDifferenceAbs = Math.abs(secondsDifference);

  // every 10 seconds (necessary, if too short it might not change value and stop DateView refresh)
  if (secondsDifferenceAbs < 60) {
    return 10_000;
  }
  // every minute
  if (secondsDifferenceAbs < 3600) {
    return 60_000;
  }
  // never
  return 0;
}

function format(dateTime: string | undefined, options: Intl.DateTimeFormatOptions, culture: string): string {
  if (!dateTime) {
    return '';
  }
  const date = Date.parse(dateTime);
  if (!date) {
    return '';
  }
  return new Intl.DateTimeFormat(culture, options).format(date);
}

export function useDateFormat(culture: string = 'en-US') {
  return {
    format: (date: string | undefined, options: Intl.DateTimeFormatOptions) => format(date, options, culture),
    formatDate: (date: string | undefined) => format(date, { dateStyle: 'short' }, culture),
    formatTime: (date: string | undefined) => format(date, { timeStyle: 'short' }, culture),
    formatDateTime: (date: string | undefined) => format(date, { dateStyle: 'short', timeStyle: 'short' }, culture),
    getRelativeRefresh: (date: string | undefined) => getRelativeRefresh(date),
    relative: (date: string | undefined) => relative(date, culture),
  };
}
