import { NextRouter, useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { InputValues } from './useQueryUpdater';

interface FilterName {
  key: string;
  isArray: boolean;
}

// This function initializes the filters based on the router query and a list of filter names
const initFilters = (router: NextRouter, filterNames: FilterName[]) => {
  // This object will hold the filters as key-value pairs
  const filters: InputValues = {};

  // Loop through each filter name
  filterNames.forEach((filterName) => {
    // Destructure the key and isArray properties from the filterName object
    const { key, isArray } = filterName;

    // Get the query value for the current filter key
    const queryValue = router.query[key];

    // If the filter is an array, split the query value by comma and assign it to the filter object
    if (isArray) {
      filters[key] = queryValue ? (queryValue as string).split(',') : [];
    } else {
      // Otherwise, just assign the query value directly to the filter object
      filters[key] = queryValue || '';
    }
  });

  // Return the filters object
  return filters;
};

const useFilters = (filterNames: FilterName[]) => {
  // Get the router object
  const router = useRouter();

  // Use the useState hook to create a state variable for filters
  const [filters, setFilters] = useState<InputValues>(
    // Initialize the filters state with the result of calling initFilters()
    initFilters(router, filterNames)
  );

  // Use the useRef hook to create a mutable reference to a boolean value
  const filtersSetted = useRef(false);

  // Use the useEffect hook to run a side effect whenever the router or filter names change
  useEffect(() => {
    // If all of the filter keys are not present in the router query, or the filters have already been set, return
    if (
      filterNames.every(({ key }) => !router.query[key]) ||
      filtersSetted.current
    ) {
      return;
    }

    // Otherwise, set the filters state by calling initFilters()
    setFilters(initFilters(router, filterNames));

    // Set the mutable reference to true to indicate that the filters have been set
    filtersSetted.current = true;
  }, [router, filterNames]);

  // Return the filters state and setFilters function
  return { filters, setFilters };
};

export default useFilters;
