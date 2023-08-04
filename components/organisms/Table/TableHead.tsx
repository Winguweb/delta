import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { SortTableArrows } from './SortTableArrows';

type BaseTableHeaderItemProps<Data = Record<string, string>> = {
  label: string;
  key: string | keyof Data;
};

type TableHeaderActionItemProps<Data = Record<string, string>> =
  BaseTableHeaderItemProps<Data> & {
    isAction: true;
    key: string;
  };

type TableHeaderDataItemProps<Data = Record<string, string>> =
  BaseTableHeaderItemProps<Data> & {
    key: keyof Data;
    isAction?: false;
    onSort?: (accessor: TableHeaderItemProps<Data>['key']) => void;
  };

export type TableHeaderItemProps<Data = Record<string, string>> =
  | TableHeaderActionItemProps<Data>
  | TableHeaderDataItemProps<Data>;

type TableHeadProps<Data = Record<string, string>> = React.PropsWithChildren<{
  headers: TableHeaderItemProps<Data>[];
}>;

type ColumnHeaderProps = {
  children?: ReactNode;
  className?: string;
  onColumnSort?: () => void;
};

const ColumnHeader = (props: ColumnHeaderProps) => {
  const { children, className, onColumnSort } = props;
  return (
    <th className={classNames('py-3 px-4', className)}>
      {onColumnSort ? (
        <div
          className="flex items-center cursor-pointer"
          onClick={onColumnSort}
        >
          {children}
          <button className="ml-4">
            <SortTableArrows />
          </button>
        </div>
      ) : (
        children
      )}
    </th>
  );
};

function TableHead<Data = Record<string, string>>({
  headers,
}: TableHeadProps<Data>) {
  return (
    <thead>
      <tr className="text-sm text-gray-700 font-light">
        {headers.map((header) => {
          return (
            <ColumnHeader
              key={header.key as string}
              onColumnSort={
                !header.isAction
                  ? () => header.onSort?.(header.key as string)
                  : undefined
              }
              className={header.isAction ? 'text-center' : ''}
            >
              {header.label}
            </ColumnHeader>
          );
        })}
      </tr>
    </thead>
  );
}
export default TableHead;
