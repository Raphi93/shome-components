export type ActionReducer = { type: string; value?: string; allValues?: string[] };

export function checkedReducer(state: string[], action: ActionReducer): string[] {
  switch (action.type) {
    case 'add':
      if (!action.value) {
        throw new Error();
      }
      return [...state, action.value];
    case 'remove':
      if (!action.value) {
        throw new Error();
      }
      return state.filter((a) => a !== action.value);
    case 'check-all':
      if (!action.allValues) {
        throw new Error();
      }
      return action.allValues;
    case 'uncheck-all':
      return [];
    default:
      throw new Error();
  }
}

export function checkedSingleReducer(state: string[], action: ActionReducer): string[] {
  switch (action.type) {
    case 'add':
      if (!action.value) {
        throw new Error();
      }
      return [action.value];
    case 'remove':
      if (!action.value) {
        throw new Error();
      }
      return state.filter((a) => a !== action.value);
    case 'check-all':
      if (!action.allValues) {
        throw new Error();
      }
      return action.allValues;
    case 'uncheck-all':
      return [];
    default:
      throw new Error();
  }
}


