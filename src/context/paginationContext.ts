import { createContext } from 'react';
import { Pagination } from '../types/Grid';

export const PaginationContext = createContext<Pagination | undefined>(undefined);
