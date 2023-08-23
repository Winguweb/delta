import { Change } from '@prisma/client';
import { compareAsc, format } from 'date-fns';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import axiosFromServerSideProps from '../../utils/axiosFromServerSideProps';
import AdminLayout from '../../components/organisms/Layout/AdminLayout';
import Text from '../../components/molecules/Text';
import Pagination from '../../components/molecules/Pagination';
import { useState } from 'react';

interface ChangelogProps {
  changes: (Omit<Change, 'createdAt'> & { createdAt: string })[];
}

export const getServerSideProps: GetServerSideProps<ChangelogProps> = async (
  ctx
) => {
  try {
    const session = await getSession(ctx);
    const headers = ctx.req.headers;

    const changes: Change[] = await (
      await axiosFromServerSideProps(ctx)
    )
      .get(`/api/admin/changes`, {
        headers:
          session && headers.cookie ? { Cookie: headers.cookie } : undefined,
      })
      .then((res) => res.data);

    return {
      props: {
        changes: JSON.parse(JSON.stringify(changes
          .sort(({ createdAt }) => compareAsc(createdAt, new Date()))))
      },
    };
  } catch (e) {
    return {
      props: {
        changes: [],
      },
    };
  }
};

const parser = ([key, value]: [string, string | Record<string, string>]) => {
  if (typeof value !== 'string') {
    return '';
  }

  if (typeof JSON.parse(value) === 'object') {
    return `${key}:\n${Object.entries(JSON.parse(value))
      .map(([k, v]) => `  ${k}: ${v}`)
      .join('\n')}\n`;
  }

  return `${key}: ${JSON.stringify(JSON.parse(value))}\n`;
};

type TableProps = {
  headers: string[];
  data: (string | JSX.Element | null)[][];
};

function Table({ data, headers }: TableProps) {
  return (
    <div className="overflow-x-scroll rounded relative mt-4 w-full h-96">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((label) => {
              return (
                <th scope="col" className="py-3 px-6" key={label}>
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => {
            return (
              <tr
                key={`row-${i}`}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                {row.map((cell, j) => {
                  if (j < 2) {
                    return (
                      <th
                        key={`cell-${j}`}
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {cell}
                      </th>
                    );
                  }

                  return (
                    <td className="py-4 px-6" key={`cell-${j}`}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const Changelog: NextPage<ChangelogProps> = ({ changes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentChanges = changes.slice(startIndex, endIndex);

  const loadNextPageChanges = (nextPage: number) => {
    setCurrentPage(nextPage);
  };
  return (
    <AdminLayout title="Historial de cambios">
      <Text as="h1">Changelog</Text>

      <Table
        headers={['Fecha', 'Título', 'Descripción', 'Detalles']}
        data={currentChanges.map((change) => {
          return [
            format(new Date(change.createdAt), 'dd/MM/yyyy HH:mm'),
            change.title,
            change.description,
            <pre key={change.id}>
              {Object.entries(change.details ?? {}).map(parser)}
            </pre>,
          ];
        })}
      />
      <Pagination
        setPageNumber={setCurrentPage}
        pageNumber={currentPage}
        pages={Math.ceil(changes.length / itemsPerPage)} // Calcular el número total de páginas
        loadNextPage={loadNextPageChanges}
      />
    </AdminLayout>
  );
};

export default Changelog;
