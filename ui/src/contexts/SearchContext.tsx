import LocationSuggestion from '@/models/location_suggestions';
import { useState, ReactNode, createContext } from 'react';
type SearchContext = {
  // searchData: {
  //   location: LocationSuggestion;
  //   price: string[];
  //   arv: string[];
  //   distance: number;
  //   underComps: number;
  //   lastSold: string;
  // };
  searchData: {};
  setSearchData: any;
  searchResults: any;
  setSearchResults: any;
  search: any;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SearchContext = createContext<SearchContext>({} as SearchContext);

type Props = {
  children: ReactNode;
};

export function SearchProvider({ children }: Props) {
  const [searchData, setSearchData] = useState<any>();
  const [searchResults, setSearchResults] = useState<any>([]);

  const searchProperties = () => {};

  return (
    <SearchContext.Provider
      value={{
        searchData,
        setSearchData,
        searchResults,
        setSearchResults,
        searchProperties
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
