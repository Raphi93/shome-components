import { Pagination } from '..';

// ─── Default request config ───────────────────────────────────────────────────

/**
 * Base `RequestInit` configuration for JSON API calls.
 * Extend or override as needed per request.
 *
 * @example
 * fetch(url, { ...commonRequestInfo, method: 'POST', body: JSON.stringify(data) });
 */
export let commonRequestInfo: RequestInit = {
  method: 'GET',
  cache: 'no-cache',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
};

// ─── URL helpers ──────────────────────────────────────────────────────────────

/**
 * Appends pagination parameters to a URL as query string entries.
 *
 * Only non-default values are appended:
 * - `pageNumber` is omitted when it equals 1
 * - `pageSize` is omitted when it equals 25
 * - `filter` and `sort` are omitted when empty
 *
 * @param url         The base URL string.
 * @param pagination  The current pagination state (from `usePaginationQuery`).
 * @returns The full URL string with appended parameters.
 *
 * @example
 * extendUrlWithPagingParameters('/api/customers', pagination)
 * // → "/api/customers?pageNumber=3&filter=john"
 */
export function extendUrlWithPagingParameters(url: string, pagination: Pagination): string {
  const uri = new URL(url, window.document.location.toString());

  if (pagination.pageNumber > 1)   uri.searchParams.append('pageNumber', pagination.pageNumber.toString());
  if (pagination.pageSize !== 25)  uri.searchParams.append('pageSize',   pagination.pageSize.toString());
  if (pagination.filter)           uri.searchParams.append('filter',     pagination.filter);
  if (pagination.sort)             uri.searchParams.append('sort',       pagination.sort);

  return uri.href;
}

/**
 * Prepends the API root to a relative URL.
 * Returns absolute URLs (starting with `http:` or `https:`) unchanged.
 *
 * @param apiRoot  The base URL of the API, e.g. `"https://api.example.com"`.
 * @param url      A relative or absolute URL.
 * @returns The full URL, or `undefined` when `url` is empty.
 *
 * @example
 * extendUrlWithApiRoot('https://api.example.com', '/customers') // → "https://api.example.com/customers"
 * extendUrlWithApiRoot('https://api.example.com', 'https://other.com/x') // → "https://other.com/x"
 */
export function extendUrlWithApiRoot(apiRoot: string | undefined, url: string | undefined): string | undefined {
  if (!url) return url;
  if (url.startsWith('http:') || url.startsWith('https:')) return url;
  return apiRoot + url;
}
