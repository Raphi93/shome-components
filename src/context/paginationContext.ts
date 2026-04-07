import { createContext } from 'react';
import { Pagination } from '..';

export const PaginationContext = createContext<Pagination | undefined>(undefined);
