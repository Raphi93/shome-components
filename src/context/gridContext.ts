import { createContext, Dispatch, SetStateAction } from 'react';

import { ActionReducer } from '../Components/Grid/stateReducer';

type TGridContext = {
  multiSelect: boolean;
  data: {
    id: string;
    [key: string]: any;
  }[];
  checkedList?: string[];
  dispatchChecked?: Dispatch<ActionReducer>;
  sortedKeys?: string[];
  setSortedKeys?: Dispatch<SetStateAction<string[]>>;
};

const DefaultGridProps = {
  multiSelect: false,
  data: [],
  sortedKeys: [],
};

export const GridContext = createContext<TGridContext>(DefaultGridProps);

type TGridColumnContext = {
  item: any;
  maxAllowedExpandedWidthFields: Record<string, number>;
  expandedWidthFields: Record<string, number>;
  setExpandedWidthFields: Dispatch<SetStateAction<Record<string, number>>>;
  currentlyResizingField: string | null;
  setCurrentlyResizingField: Dispatch<SetStateAction<string | null>>;
};

const DefaultGridColumnProps: TGridColumnContext = {
  item: undefined,
  maxAllowedExpandedWidthFields: {},
  expandedWidthFields: {},
  setExpandedWidthFields: () => {},
  currentlyResizingField: null,
  setCurrentlyResizingField: () => {},
};

export const GridColumnContext = createContext<TGridColumnContext>(DefaultGridColumnProps);
