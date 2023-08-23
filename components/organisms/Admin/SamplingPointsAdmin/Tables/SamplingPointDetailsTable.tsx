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
  isAbleToPerformActions?: boolean;
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
  name: string;
  id: number;
  owner: string;
}

export const SamplingPointDetailsTable: React.FC<SamplingPointDetailsTableProps> = (
  { samples, devices, samplingPointId, isAbleToPerformActions }
) => {


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sampleId, setSampleId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false);


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
    name: device.name,
    id: device.id,
    owner: device.owner.organizationName,
  }));

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
              },
              {
                key: 'time',
                label: 'Hora',
                isAction: true,
              },
              {
                key: 'ph',
                label: 'Ph',
                isAction: true,
              },
              {
                key: 'temperature',
                label: 'Temperatura',
                isAction: true,
              },
              {
                key: 'electroconductivity',
                label: 'Electroconductividad',
                isAction: true,
              },
              {
                key: 'responsible',
                label: 'Responsable',
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
                isAbleToPerformActions ?
                  <IconButton
                    onClick={() => handleDeleteSample((data as TransformedSampleType).id)}
                    icon={<TrashIcon />}
                    variant="primary-admin"
                    iconSize="xs"
                    iconColor='danger'
                    className="justify-self-center"
                  /> : 
                  <IconButton
                  icon={<TrashIcon />}
                  variant="primary-admin"
                  iconSize="xs"
                  iconColor='danger'
                  className="justify-self-center"
                  disabled={true}
                />
              ),
              ({ data }) => (isAbleToPerformActions ?
                <Link href={`${samplingPointId}?sample=${(data as TransformedSampleType).id}`}>
                  <IconButton
                    icon={<IconPencil />}
                    variant="primary-admin"
                    iconSize="xs"
                    className="justify-self-center"
                  />
                </Link> :  
                <IconButton
                    icon={<IconPencil />}
                    variant="primary-admin"
                    iconSize="xs"
                    className="justify-self-center"
                    disabled={true}
                  />
              ),
            ]}
            data={[...transformedSamples]}
            formatCell={[
              {
                condition: (key) => key === 'date' || key === 'time' ||  key === 'responsible',
                component: ({ value }) => {
                  return <Text as="p2">{value}</Text>;
                },
              },
              {
                condition: (key) => key === 'ph' || key === 'temperature' || key === 'electroconductivity',
                component: ({ value }) => {
                  return <Text as="p2" className='text-center'>{value}</Text>;
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
              key: 'name',
              label: 'Nombre',
            },
            {
              key: 'id',
              label: 'ID',
              isAction: true,
            },
            {
              key: 'owner',
              label: 'Propietario',
              isAction: true,
            }
          ]}
          cells={[
            'name',
            'id',
            'owner',
          ]}
          data={[...transformedDevices]}
          formatCell={[
            {
              condition: (key) => key === 'name',
              component: ({ value }) => {
                return <Text as="p2" className='text-left text-ellipsis truncate w-full overflow-hidden'>{value}</Text>;
              },
            },
            {
              condition: (key) => key === 'id' || key === 'owner',
              component: ({ value }) => {
                return <Text as="p2" className='text-center'>{value}</Text>;
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

