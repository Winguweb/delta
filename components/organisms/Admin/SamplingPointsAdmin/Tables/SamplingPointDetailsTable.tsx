import React, { useState } from 'react';
import { GetSampleResponse } from '../../../../../model/sample';
import Text from '../../../../molecules/Text';
import { GetDeviceResponse } from '../../../../../model/device';
import moment from 'moment';
import IconButton from '../../../../molecules/Buttons/IconButton';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Table from '../../../Table';
import { useRouter } from 'next/router';
import useDebounce from '../../../../../hooks/useDebounce';
import useFilters from '../../../../../hooks/useFilters';
import { useAuthenticatedUser } from '../../../../../hooks/useAuthenticatedUser';
import { IconPencil } from '../../../../../assets/icons';
import axios from 'axios';
import { AlertDeleteModal } from '../../../AlertDeleteModal';
import { ResponseModal } from '../../../ResponseModal';


interface SamplingPointDetailsTableProps {
  samplingPointId?: string;
  samples?: GetSampleResponse[];
  devices?: GetDeviceResponse[];
}

type TransformedSampleType = {
  date: string;
  time: string;
  ph: number;
  temperature: number;
  electroconductivity: number;
  responsible: string;
  id: number;
  ownerId: string;
}

type TransformedDeviceType = {
  id: number;
  name: string;
  owner: string;
  description: string | null;
}

export const SamplingPointDetailsTable: React.FC<SamplingPointDetailsTableProps> = ({ samples, devices, samplingPointId }) => {


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sampleId, setSampleId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false);


  const { filters, setFilters } = useFilters([
    { key: 'search', isArray: false },
    { key: 'status', isArray: false },
  ]);

  const debouncedFilters = useDebounce(filters, 700);

  const transformedSamples: TransformedSampleType[] | undefined = samples?.map((sample) => (
    {
      date: moment(sample.takenAt).format('DD/MM/yyyy'),
      time: moment(sample.takenAt).format('HH:mm'),
      ph: sample.measurementValues["pH [Unidades de pH]"],
      temperature: sample.measurementValues["Temperatura del Agua [°Celsius]"],
      electroconductivity: sample.measurementValues["Conductividad [µs/cm]"],
      responsible: `${sample?.takenBy.firstName} ${sample?.takenBy.lastName}`,
      id: sample.id,
      ownerId: sample.takenBy.id
    }));

  const transformedDevices: TransformedDeviceType[] | undefined = devices?.map((device) => ({
    id: device.id,
    name: device.name,
    owner: device.owner.organizationName,
    description: device.description,
  }));

  const user = useAuthenticatedUser();
  const isOwner = (sampleSelected: TransformedSampleType) => {
    return sampleSelected.ownerId === user?.id;
  }

  const handleDeleteSample = (id: number) => {
    setSampleId(id)
    setShowDeleteModal(true);
  };

  const confirmDeleteSample = async () => {
    setShowDeleteModal(false);
    try {
      await axios.delete(`/api/sampling-points/${samplingPointId}/samples/${sampleId}`);
      setSuccessMessage('Muestra eliminada exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al eliminar la muestra');
    }
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return samples ? (
    <>
      {
        transformedSamples?.length ?
          <Table
            headers={[
              {
                key: 'date',
                label: 'Fecha',
                isAction: false,
              },
              {
                key: 'time',
                label: 'Hora',
                isAction: false,
              },
              {
                key: 'ph',
                label: 'Ph',
                isAction: false,
              },
              {
                key: 'temperature',
                label: 'Temperatura',
                isAction: false,
              },
              {
                key: 'electroconductivity',
                label: 'Electroconductividad',
                isAction: false,
              },
              {
                key: 'responsible',
                label: 'Responsable',
                isAction: false,
              },
              { key: 'delete', label: 'Eliminar', isAction: true },
              { key: 'edit', label: 'Editar', isAction: true },
            ]}
            cells={[
              'date',
              'time',
              'ph',
              'temperature',
              'electroconductivity',
              'responsible',
            ]}
            actions={[
              ({ data }) => (
                isOwner(data as TransformedSampleType) ?
                  <IconButton
                    onClick={() => handleDeleteSample((data as TransformedSampleType).id)}
                    icon={<TrashIcon />}
                    variant="primary-admin"
                    iconSize="xs"
                    iconColor='danger'
                    className="justify-self-center"
                  /> : ''
              ),
              ({ data }) => (
                isOwner(data as TransformedSampleType) ?
                  <Link href={`${samplingPointId}?sample=${(data as TransformedSampleType).id}`}>
                    <IconButton
                      icon={<IconPencil />}
                      variant="primary-admin"
                      iconSize="xs"
                      className="justify-self-center"
                    />
                  </Link> : ''
              ),
            ]}
            data={transformedSamples}
            formatCell={[
              {
                condition: (key) => key === 'date' || key === 'time' || key === 'ph' || key === 'temperature' || key === 'electroconductivity' || key === 'responsible',
                component: ({ value }) => {
                  return <Text as="p2">{value}</Text>;
                },
              },
            ]}
          />
          :
          <Text as="p2" className='m-4'>Sin muestras</Text>
      }
      {showDeleteModal && (
        <AlertDeleteModal
          showModal={showDeleteModal}
          message={`Se eliminará la muestra con ID: ${sampleId}`}
          onCancel={onCancelDelete}
          onConfirm={confirmDeleteSample}
        />
      )}
      {showModal && (
        <ResponseModal
          showModal={showModal}
          message={successMessage}
          routePathname={`/admin/sampling-points/${samplingPointId}`}
        />
      )}
    </>
  ) : (
    <>
      {transformedDevices?.length ?
        <Table
          headers={[
            {
              key: 'id',
              label: 'ID',
              isAction: false,
            },
            {
              key: 'name',
              label: 'Nombre',
              isAction: false,
            },
            {
              key: 'owner',
              label: 'Propietario',
              isAction: false,
            },
            {
              key: 'description',
              label: 'Descripción',
              isAction: false,
            }
          ]}
          cells={[
            'id',
            'name',
            'owner',
            'description',
          ]}
          data={transformedDevices}
          formatCell={[
            {
              condition: (key) => key === 'id' || key === 'name' || key === 'owner' || key === 'description',
              component: ({ value }) => {
                return <Text as="p2">{value}</Text>;
              },
            },
          ]}
        />
        :
        <Text as="p2" className='mx-4 p-4'>Sin dispositivos</Text>
      }

    </>
  );
};

