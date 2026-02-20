export type Pagination = {
    pageNumber: number;
    pageSize: number;
    filter: string;
    sort: string;
    setPageSize: (newPageSize: number) => void;
    setPageNumber: (newPageNumber: number) => void;
    setFilter: (newFilter: string | undefined) => void;
    setSort: (newSort: string | undefined) => void;
};

export type PagedList<T> = {
    totalCount: number;
    list: T[];
};