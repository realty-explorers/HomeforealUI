import LocationSuggestion from '@/models/location_suggestions';
import { useState, ReactNode, createContext } from 'react';
type SearchContext = {
  search: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SearchContext = createContext<SearchContext>({} as SearchContext);

type Props = {
  children: ReactNode;
};

export function SearchProvider({ children }: Props) {
  const searchProperties = () => {};

  return (
    <SearchContext.Provider value={{ searchProperties }}>
      {children}
    </SearchContext.Provider>
  );
}
