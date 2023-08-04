import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import useSWR from 'swr/immutable';
import axios from 'axios';

export type InputValues = Record<string, string | string[]>;

interface Options {
  key?: string;
  baseClientUrlParams?: Record<string, string>;
}

// Function to get query string from URL
// Build an object of key-value pairs for the query string, using the input values from the inputValues object
const getQuery = (inputValues: InputValues) =>
  Object.keys(inputValues).reduce((acc, key) => {
    const value = inputValues[key];
    const isArray = Array.isArray(value);

    if (!value || (isArray && value.length === 0)) {
      return acc;
    }

    acc[key] = isArray ? value.join(',') : value;
    return acc;
  }, {} as Record<string, string>);

function useQueryUpdater<T = unknown>(
  url: string | null,
  inputValues: InputValues,
  hiddenValues: InputValues = {},
  options: Options = {}
) {
  // Use the useRouter hook to get a reference to the router object
  const router = useRouter();

  // Use the useSWR hook to fetch data from the API and cache the results
  const querySwr = useSWR<T>(options.key || url, () =>
    axios
      .get(url || '', {
        params: getQuery(
          Object.entries(inputValues).reduce((acc, [key, value]) => {
            acc[key] = value || hiddenValues[key];
            return acc;
          }, {} as InputValues)
        ),
      })
      .then((r) => r.data)
  );

  // Use a ref for save last query object
  const lastInputValues = useRef<InputValues | null>(inputValues);

  const baseUrlSetted = useRef(false);

  // Use the useEffect hook to update the URL query string and refetch data from the API whenever any of the input values in the object change
  useEffect(() => {
    // If the input values are the same as the last input values, don't update the URL query string or refetch data from the API
    if (lastInputValues.current === inputValues && baseUrlSetted.current) {
      return;
    }

    // Get query
    const query = getQuery(inputValues);

    // Create url to redirect
    const clientUrl = new URL(window.location.href);

    const params = new URLSearchParams({
      ...options.baseClientUrlParams,
      ...query,
    });

    clientUrl.search = `?${params.toString()}`;

    // Update the URL query string
    router.push(clientUrl, undefined, {
      shallow: true,
    });

    if (url) {
      // Fetch data from the API using the current URL path and query string. This triggers a revalidation of the SWR cache and re-renders the component
      querySwr.mutate();
    }

    // Save the current URL path and query string to the ref
    lastInputValues.current = inputValues;

    baseUrlSetted.current = true;
  }, [inputValues, router, querySwr, url, options.baseClientUrlParams]);

  // Return the querySwr object
  return querySwr;
}

export default useQueryUpdater;
