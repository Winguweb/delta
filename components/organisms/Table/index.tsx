import React, { useState } from 'react';
import { TableBody, TableBodyProps } from './TableBody';
import TableHead, { TableHeaderItemProps } from './TableHead';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import InputText from '../../molecules/Input/InputText';
import Select from '../../molecules/Input/Select';

type TableProps<Data = Record<string, string>> = {
  data?: Data[];
  headers: TableHeaderItemProps<Data>[];
  cells: (keyof Data)[];
  actions?: TableBodyProps['actions'];
  searchInput?: {
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
  };
  selectInput?: {
    placeholder: string;
    onChange: (value: string) => void;
    options: { label: string; value: string | null }[];
    value: string | null;
  };
  formatCell?: TableBodyProps['formatCell'];
};

function Table<Data = Record<string, string> | undefined>({
  cells,
  headers,
  actions,
  data,
  searchInput,
  formatCell,
  selectInput,
}: TableProps<Data>) {
  const [sortField, setSortField] = useState<keyof Data | null>(null);
  const [order, setOrder] = useState('asc');

  // This function handles sorting a list of SignupRequest objects based on a given field and sort order.
  const sortRows = (): Data[] => {
    // If there is no data or the sort field is undefined, return the original data array
    if (!data || !sortField) {
      return data ?? [];
    }

    // Sort data using the Array.sort method
    const sorted = data.sort((a, b) => {
      // Get the values of the sort field for the two objects
      const aFieldValue = a[sortField];
      const bFieldValue = b[sortField];

      // If either value is undefined or null, place it at the end of the list
      if (aFieldValue === undefined || aFieldValue === null) {
        return 1;
      }
      if (bFieldValue === undefined || bFieldValue === null) {
        return -1;
      }

      // Compare the values of the sort field for the two objects using the String.localeCompare method
      // This method compares the strings based on the given locale (in this case, "es" for Spanish) and
      // sorts them in a numeric order if the numeric option is set to true
      // The result of the comparison is then multiplied by 1 or -1 based on the sort order (ascending or descending)
      return (
        (aFieldValue as unknown as string)
          .toString()
          .localeCompare((bFieldValue as unknown as string).toString(), 'es', {
            numeric: true,
          }) * (order === 'asc' ? 1 : -1)
      );
    });

    return sorted;
  };

  const handleColumnSort = (accessor: keyof Data) => {
    const sortOrder =
      accessor === sortField && order === 'asc' ? 'desc' : 'asc';

    setSortField(accessor);
    setOrder(sortOrder);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex space-x-4">
        {searchInput && (
          <InputText
            name="search"
            placeholder={searchInput.placeholder}
            onChange={searchInput.onChange}
            icon={<MagnifyingGlassIcon />}
            allWrapperClassName="w-full lg:w-2/3"
            value={searchInput.value}
          />
        )}
        {selectInput && (
          <div className="w-full lg:w-1/3">
            <Select
              value={selectInput.value}
              onChange={(value) => selectInput.onChange(value as string)}
              placeholder={selectInput.placeholder}
            >
              {selectInput.options.map((option) => (
                <Select.Option value={option.value} key={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="table w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <TableHead<Data>
            headers={headers.map((header) => ({
              ...header,
              onSort: !header.isAction
                ? () => handleColumnSort(header.key)
                : undefined,
            }))}
          />
          <TableBody<Data>
            data={sortRows()}
            cells={cells}
            // @ts-ignore
            formatCell={formatCell}
            // @ts-ignore
            actions={actions}
          />
        </table>
      </div>
    </div>
  );
}

export default Table;
