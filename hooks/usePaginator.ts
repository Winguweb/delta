import { useState } from 'react';

function usePaginator<T>(arr: T[] = [], size = 10) {
  const [pageNumber, setPageNumber] = useState(1);

  const arrCopy = [...arr];
  const pages = Math.ceil(arrCopy.length / size);
  var startPage: number, endPage: number;

  if (pages <= 10) {
    // less than 10 total pages so show all

    startPage = 1;

    endPage = pages;
  } else {
    // more than 10 total pages so calculate start and end pages

    if (pageNumber <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (pageNumber + 4 >= pages) {
      startPage = pages - 9;

      endPage = pages;
    } else {
      startPage = pageNumber - 5;

      endPage = pageNumber + 4;
    }
  }

  // calculate start and end item indexes

  var startIndex = (pageNumber - 1) * size;

  var endIndex = Math.min(startIndex + size - 1, arrCopy.length - 1);

  return {
    items: arrCopy.slice((pageNumber - 1) * size, pageNumber * size),
    pages,
    pageNumber,
    // pagesList: [...Array(pages)].map((_, i) => i + 1),
    pagesList: [...Array.from(Array(endPage + 1 - startPage).keys())].map(
      (i) => startPage + i
    ),
    setPageNumber,
    startPage: startPage,
    endPage: endPage,
    startIndex: startIndex,
    endIndex: endIndex,
  };
}

export { usePaginator };
