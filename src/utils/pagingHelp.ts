import { PagedList } from '..';

/**
 * Returns a new `PagedList<T>` with the item matching `id` removed.
 * Use this to optimistically update a list after a successful delete request
 * without refetching the full page.
 *
 * @param id    The `id` of the item to remove.
 * @param data  The current paged list from the server.
 * @returns A new object with `totalCount` decremented and the item excluded from `list`.
 *
 * @example
 * const updated = updatePagedList(deletedId, currentPage);
 * setPageData(updated);
 */
export function updatePagedList<T extends { id: string }>(id: string, data: PagedList<T>): PagedList<T> {
  return {
    totalCount: data.totalCount - 1,
    list: data.list.filter((a) => a.id !== id),
  };
}
