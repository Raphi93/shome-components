import { PagedList } from "..";


export function updatePagedList<T extends { id: string }>(id: string, data: PagedList<T>) {
  return { totalCount: data.totalCount - 1, list: data.list.filter((a) => a.id !== id) };
}
