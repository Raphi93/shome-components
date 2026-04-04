// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a UTC date string as a human-readable relative string.
 *
 * Rules:
 * - < 60 s  → "10 seconds ago" / "in 10 seconds"
 * - < 1 h   → "5 minutes ago" / "in 5 minutes"
 * - same day  → "14:30"
 * - same year → "Jan 5, 14:30"
 * - older     → "Jan 5, 2023" (with time if < 30 days)
 */
function relative(dateTime: string | undefined, culture: string): string {
  if (!dateTime) return '';
  const date = Date.parse(dateTime);
  if (!date) return '';

  const now = Date.now();
  const secondsDifference = (date - now) / 1000;
  const secondsDifferenceAbs = Math.abs(secondsDifference);

  if (secondsDifferenceAbs < 60) {
    return new Intl.RelativeTimeFormat(culture, { style: 'short' }).format(
      Math.round(secondsDifference / 10) * 10,
      'second'
    );
  }
  if (secondsDifferenceAbs < 3600) {
    return new Intl.RelativeTimeFormat(culture, { style: 'short' }).format(
      Math.round(secondsDifference / 60),
      'minute'
    );
  }

  const nowDate = new Date(now);
  const formattedDate = new Date(date);

  if (
    nowDate.getFullYear() === formattedDate.getFullYear() &&
    nowDate.getMonth() === formattedDate.getMonth() &&
    nowDate.getDay() === formattedDate.getDay()
  ) {
    return new Intl.DateTimeFormat(culture, { hour: 'numeric', minute: 'numeric' }).format(date);
  }

  if (nowDate.getFullYear() === formattedDate.getFullYear()) {
    return new Intl.DateTimeFormat(culture, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
    }).format(date);
  }

  const isLessThanMonth = secondsDifferenceAbs < 30 * 24 * 60 * 60;

  return new Intl.DateTimeFormat(culture, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: isLessThanMonth ? 'numeric' : undefined,
    minute: isLessThanMonth ? 'numeric' : undefined,
  }).format(date);
}

/**
 * Returns the recommended refresh interval (ms) for a relative date display.
 * Returns 0 when the value is older than 1 hour — no refresh needed at that point.
 *
 * Use with `setInterval` in a component that shows a relative timestamp.
 */
function getRelativeRefresh(dateTime: string | undefined): number {
  if (!dateTime) return 0;
  const date = Date.parse(dateTime);
  if (!date) return 0;

  const secondsDifferenceAbs = Math.abs((date - Date.now()) / 1000);

  if (secondsDifferenceAbs < 60)   return 10_000; // refresh every 10 s
  if (secondsDifferenceAbs < 3600) return 60_000; // refresh every 1 min
  return 0;                                        // no refresh needed
}

/** Formats a UTC date string using the given `Intl.DateTimeFormatOptions`. */
function format(dateTime: string | undefined, options: Intl.DateTimeFormatOptions, culture: string): string {
  if (!dateTime) return '';
  const date = Date.parse(dateTime);
  if (!date) return '';
  return new Intl.DateTimeFormat(culture, options).format(date);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns locale-aware date formatting utilities.
 *
 * @param culture  BCP 47 language tag, e.g. `"de-CH"`, `"en-US"`. Default: `"en-US"`.
 *
 * @example
 * const fmt = useDateFormat('de-CH');
 * fmt.formatDate('2024-06-01T00:00:00Z')   // → "01.06.2024"
 * fmt.formatDateTime('2024-06-01T14:30:00Z') // → "01.06.2024, 14:30"
 * fmt.relative('2024-06-01T14:25:00Z')      // → "vor 5 Min."
 */
export function useDateFormat(culture: string = 'en-US') {
  return {
    /** Format with arbitrary `Intl.DateTimeFormatOptions`. */
    format: (date: string | undefined, options: Intl.DateTimeFormatOptions) =>
      format(date, options, culture),

    /** Short date only, e.g. "01.06.2024" */
    formatDate: (date: string | undefined) =>
      format(date, { dateStyle: 'short' }, culture),

    /** Short time only, e.g. "14:30" */
    formatTime: (date: string | undefined) =>
      format(date, { timeStyle: 'short' }, culture),

    /** Short date + time, e.g. "01.06.2024, 14:30" */
    formatDateTime: (date: string | undefined) =>
      format(date, { dateStyle: 'short', timeStyle: 'short' }, culture),

    /**
     * Returns the recommended polling interval (ms) to keep a relative
     * timestamp up-to-date. Returns 0 when no refresh is needed.
     */
    getRelativeRefresh: (date: string | undefined) => getRelativeRefresh(date),

    /**
     * Human-readable relative string, e.g. "5 min ago" or "in 10 sec".
     * Falls back to an absolute date for older values.
     */
    relative: (date: string | undefined) => relative(date, culture),
  };
}
