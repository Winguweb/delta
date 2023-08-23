import { PencilIcon } from '@heroicons/react/24/outline';
import { UserRole, UserStatus } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useFilters from '../../../../hooks/useFilters';
import useDebounce from '../../../../hooks/useDebounce';
import useQueryUpdater from '../../../../hooks/useQueryUpdater';
import StatusTag from './StatusTag';
import roleDict from '../../../../utils/rolesDictionary';
import IconButton from '../../../molecules/Buttons/IconButton';
import Table from '../../Table';
import { SignupRequest } from '../../../../model/signup';
import { IconPencil } from '../../../../assets/icons';

interface UsersProps {
  refresh?: number;
}

const Users: React.FC<UsersProps> = ({ refresh }) => {
  const router = useRouter();

  const { filters, setFilters } = useFilters([
    { key: 'search', isArray: false },
    { key: 'status', isArray: false },
  ]);

  const debouncedFilters = useDebounce(filters, 700);

  const { data, mutate } = useQueryUpdater<SignupRequest[]>(
    '/api/admin/users',
    debouncedFilters,
    {
      status: ['ACTIVE', 'INACTIVE'],
    },
    {
      key: 'current-users',
      baseClientUrlParams: {
        tab: 'users',
      },
    }
  );

  useEffect(() => {
    if (refresh) {
      mutate();
    }
  }, [refresh, mutate]);

  return (
    <>
      <Table
        headers={[
          {
            key: 'firstName',
            label: 'Nombre',
            isAction: false,

          },
          {
            key: 'lastName',
            label: 'Apellido',
            isAction: false,

          },
          {
            key: 'role',
            label: 'Rol',
            isAction: false,

          },
          {
            key: 'status',
            label: 'Estado',
            isAction: false,
          },
          { key: 'edit', label: 'Editar', isAction: true },
        ]}
        cells={['firstName', 'lastName', 'role', 'status']}
        actions={[
          ({ data }) => (
            <IconButton
              icon={<IconPencil />}
              iconSize="small"
              variant="primary-admin"
              onClick={async () => {
                await router.push(
                  `/admin/users/${(data as SignupRequest).id}`
                );
              }}
            />
          ),
        ]}
        data={data}
        searchInput={{
          value: filters.search as string,
          onChange: (e) => setFilters({ ...filters, search: e.target.value }),
          placeholder:
            'Buscar por nombre, apellido, DNI, legajo o establecimiento asociado...',
        }}
        selectInput={{
          value: filters.role as string,
          onChange: (value) =>
            setFilters({ ...filters, role: value as string }),
          options: [
            { label: 'Todos', value: null },
            ...(Object.entries(roleDict) as [string, string][]).map(
              ([key, value]) => ({
                label: value,
                value: key,
              })
            ),
          ],
          placeholder: 'Filtrar por rol',
        }}
        formatCell={[
          {
            condition: (key) => key === 'status',
            component: ({ value }) => {
              return <StatusTag status={value as UserStatus} />;
            },
          },
          {
            condition: (key) => key === 'role',
            component: ({ value }) => {
              return <>{roleDict[value as UserRole]}</>;
            },
          },
        ]}
      />
    </>
  );
};

export default Users;
