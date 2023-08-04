import classNames from 'classnames';
import React, { PropsWithChildren, ReactNode } from 'react';

export type TableBodyProps<Data = Record<string, string>> =
  React.PropsWithChildren<{
    className?: string;
    data: Data[];
    cells: (keyof Data)[];
    actions?: React.FC<{ data: unknown }>[];
    formatCell?: {
      condition: (key: keyof Data) => boolean;
      component: React.FC<{ value: Data[keyof Data] }>;
    }[];
  }>;

type CellProps = {
  children?: ReactNode;
  className?: string;
};

const Cell = React.memo<CellProps>((props) => {
  const { children, className } = props;
  return <td className={classNames('py-3 px-4', className)}>{children}</td>;
});

const ActionCell: React.FC<PropsWithChildren> = ({ children }) => (
  <Cell className="text-center">{children}</Cell>
);

export function TableBody<Data = Record<string, string>>({
  data,
  cells,
  formatCell,
  actions,
}: TableBodyProps<Data>) {
  return (
    <tbody className="text-sm">
      {data.map((data, index) => {
        const rowData = cells.map((cell) => data[cell]);

        return (
          // TODO: key={index} is not a good idea
          <tr key={index} className="hover:bg-gray-100">
            {rowData.map((cell, i) => {
              const foundFormatCell = formatCell?.find((format) =>
                format.condition(cells[i])
              );
              const shouldFormat = !!foundFormatCell;

              return (
                <Cell key={`${rowData[i]}-${i}`}>
                  {shouldFormat
                    ? foundFormatCell.component({ value: data[cells[i]] })
                    : (cell as unknown as string | undefined) || '-'}
                </Cell>
              );
            })}

            {actions?.map((Action, i) => {
              return (
                <ActionCell key={i}>
                  <Action data={data} />
                </ActionCell>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
