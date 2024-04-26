"use client";

//keep track of all of currently selected category filters and options

import {createContext, ReactNode, SetStateAction, useContext, useState} from "react";

export const INITIAL_FILTER_DATA = {
  categoryFilter: [],
  setCategoryFilters: () => [],
  sort: '',
  setSort: () => '',
}

const FilterContext = createContext<IContextType>(INITIAL_FILTER_DATA);

interface IContextType {
  categoryFilters: string[],
  setCategoryFilters: React.Dispatch<SetStateAction<string[]>>
  sort: string;
  setSort: React.Dispatch<SetStateAction<string>>
}

export const CategoryFilterProvider = ({children}: {children : ReactNode}) => {
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [sort, setSort] = useState('-createdAt')

  return (
    <FilterContext.Provider value={{
      categoryFilters,
      setCategoryFilters,
      sort,
      setSort
    }}>
      {children}
    </FilterContext.Provider>
  )
}
//define custom hook to consume this context

export const useFilter = () => useContext(FilterContext);
