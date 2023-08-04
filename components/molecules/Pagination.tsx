import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Icon } from './Icon';
import { useEffect, useState } from 'react';
import Text from './Text';

type Props = React.PropsWithChildren<{
  setPageNumber: (e: any) => void;
  pageNumber: number;
  pages: number;
  loadNextPage: any;
}>;

const Pagination = (props: Props) => {
  const { pages, setPageNumber, pageNumber, loadNextPage } = props;

  const handlePreviousPage = () => {
    const prevPage = pageNumber - 1;
    if (prevPage >= 1) {
      setPageNumber(prevPage);
      loadNextPage(prevPage)
    }
  };

  const handleNextPage = () => {
    const nextPage = pageNumber + 1;
    if (nextPage <= pages) {
      setPageNumber(nextPage);
      loadNextPage(nextPage)
    }
  };


  return (
    <div className="w-full flex justify-center mt-6">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            className="mr-4 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
            onClick={() =>
              handlePreviousPage()
            }
          >
            <span className="sr-only">Previous</span>
            <Icon circle={true} size='small' className='bg-primary text-white p-1' icon={<ChevronLeftIcon />} />
          </button>
        </li>
        <li>
          <Text as='p1'>
            Página <strong className="text-blue-gray-900">{pageNumber}</strong> de{" "}
            <strong className="text-blue-gray-900">{pages}</strong>
          </Text>
        </li>

        <li>
          <button
            className="block ml-4 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
            onClick={() =>
              handleNextPage()
            }
          >
            <span className="sr-only">Next</span>
            <Icon circle={true} size='small' className='bg-primary text-white p-1' icon={<ChevronRightIcon />} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
