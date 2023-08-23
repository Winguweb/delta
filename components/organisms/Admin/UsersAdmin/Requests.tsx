import { CheckIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserStatus } from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import React, { useState } from 'react';
import StatusTag from './StatusTag';
import UserDetail from './UserDetail';
import Table from '../../Table';
import IconButton from '../../../molecules/Buttons/IconButton';
import statusDictionary from '../../../../utils/statusDictionary';
import { Modal } from '../../Modal';
import { GetUserResponse } from '../../../../model/user';
import { SignupRequest } from '../../../../model/signup';
import useFilters from '../../../../hooks/useFilters';
import useDebounce from '../../../../hooks/useDebounce';
import useQueryUpdater from '../../../../hooks/useQueryUpdater';

interface RequestsProps {
  onRefresh?: () => void;
}

const Requests: React.FC<RequestsProps> = ({ onRefresh }) => {
  const { filters, setFilters } = useFilters([
    { key: 'search', isArray: false },
    { key: 'status', isArray: false },
  ]);

  const debouncedFilters = useDebounce(filters, 700);

  const { data, mutate } = useQueryUpdater<GetUserResponse[]>(
    '/api/admin/users',
    debouncedFilters,
    {
      status: ['PENDING', 'BLOCKED'],
    },
    {
      baseClientUrlParams: {
        tab: 'requests',
      },
    }
  );

  const [index, setIndex] = useState<number | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = (index: number | undefined) => {
    if (index === undefined) {
      return;
    }

    setShowModal(true);
    setIndex(index);
  };

  function closeModal() {
    setShowModal(false);
  }

  const approveSignupRequest = async (request: GetUserResponse) => {
    const disabled = request.status === 'ACTIVE';

    if (disabled) {
      return;
    }

    await axios.post(`/api/admin/users/${request.id}/aprobar`);
    await mutate();

    onRefresh?.();
  };

  const rejectSignupRequest = async (request: GetUserResponse) => {
    const disabled = request.status === 'BLOCKED';

    if (disabled) {
      return;
    }

    await axios.post(`/api/admin/users/${request.id}/rechazar`);
    await mutate();

    onRefresh?.();
  };

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
            key: 'status',
            label: 'Estado',
            isAction: false,
          },
          { key: 'approve', label: 'Aprobar', isAction: true },
          { key: 'reject', label: 'Rechazar', isAction: true },
          { key: 'details', label: 'Detalles', isAction: true },
        ]}
        cells={['firstName', 'lastName', 'status']}
        actions={[
          ({ data }) => (
            <IconButton
              icon={<CheckIcon />}
              iconSize="xxs"
              variant="primary-admin"
              onClick={() => approveSignupRequest(data as GetUserResponse)}
              disabled={(data as SignupRequest).status === 'ACTIVE'}
            />
          ),
          ({ data }) => (
            <IconButton
              icon={<XMarkIcon />}
              iconSize="xxs"
              variant="primary-admin"
              onClick={() => rejectSignupRequest(data as GetUserResponse)}
              className={classNames([
                { '!bg-danger': (data as SignupRequest).status !== 'BLOCKED' },
                { '!bg-disabled': (data as SignupRequest).status === 'BLOCKED' },
              ])}
              disabled={(data as SignupRequest).status === 'BLOCKED'}
            />
          ),
          ({ data: rowData }) => (
            <IconButton
              icon={<EyeIcon />}
              iconSize="xxs"
              variant="primary-admin"
              iconColor='primary'
              className='bg-white border border-primary'
              onClick={() => {
                openModal(data?.indexOf(rowData as typeof data[0]));
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
          value: filters.status as string,
          onChange: (value) =>
            setFilters({ ...filters, status: value as string }),
          options: [
            { label: 'Todos', value: null },
            { label: statusDictionary['PENDING'], value: 'PENDING' },
            { label: statusDictionary['BLOCKED'], value: 'BLOCKED' },
          ],
          placeholder: 'Filtrar por estado',
        }}
        formatCell={[
          {
            condition: (key) => key === 'status',
            component: ({ value }) => {
              return <StatusTag status={value as UserStatus} />;
            },
          },
        ]}
      />

      {data && index !== null && (
        <Modal
          showModal={showModal}
          className={'bg-neutral-600/50'}
          closeButton
          onClose={closeModal}
        >
          <UserDetail
            data={data[index]}
            onAccept={async () => {
              await approveSignupRequest(data[index]);
              closeModal();
            }}
            onReject={async () => {
              await rejectSignupRequest(data[index]);
              closeModal();
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default Requests;
