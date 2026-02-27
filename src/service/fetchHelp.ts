import { Pagination } from "..";


export let commonRequestInfo: RequestInit = {
  method: 'GET',
  cache: 'no-cache',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
};

export function extendUrlWithPagingParameters(url: string, pagination: Pagination) {
  const uri = new URL(url, window.document.location.toString());

  if (pagination.pageNumber > 1) {
    uri.searchParams.append('pageNumber', pagination.pageNumber.toString());
  }
  if (pagination.pageSize !== 25) {
    uri.searchParams.append('pageSize', pagination.pageSize.toString());
  }
  if (pagination.filter) {
    uri.searchParams.append('filter', pagination.filter);
  }
  if (pagination.sort) {
    uri.searchParams.append('sort', pagination.sort);
  }

  return uri.href;
}

export function extendUrlWithApiRoot(apiRoot: string | undefined, url: string | undefined) {
  if (!url) {
    return url;
  }
  if (url.startsWith('http:') || url.startsWith('https:')) {
    return url;
  }
  return apiRoot + url;
}
