import { ArrowLeftIcon, CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { z } from 'zod';
import checkErrors from '../../../../utils/checkErrors';
import { GetDeviceResponse } from '../../../../model/device';
import { GetSamplingPointsResponse } from '../../../../model/samplingPoint';
import InputText from '../../../molecules/Input/InputText';
import Select from '../../../molecules/Input/Select';
import { Button } from '../../../molecules/Buttons/Button';
import { IconTrash } from '../../../../assets/icons';
import { ResponseModal } from '../../ResponseModal';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { DeviceApiKeyModal } from './DeviceApiKeyModal';
import { useAuthenticatedUser } from '../../../../hooks/useAuthenticatedUser';

const deviceSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido').max(100, 'El nombre puede tener un máximo de 100 caracteres'),
  externalId: z.string().max(100, 'El externalId puede tener un máximo de 100 caracteres'),
  description: z.string().min(3, 'La descripción es requerida').max(280, 'La descripción puede tener un máximo de 280 caracteres').optional(),
  components: z.string().max(280, 'Este campo puede tener un máximo de 280 caracteres').optional(),
  samplingPointId: z.string().uuid().nullable().optional(),
});

type Data = z.infer<typeof deviceSchema>;

type Errors = Record<keyof Data, string>;

type Reducer = (
  state: Data,
  action: { type: string; payload: Data[keyof Data] }
) => Data;

interface DeviceDetailProps {
  type: 'create' | 'update';
  device?: GetDeviceResponse;
  samplingPoints: GetSamplingPointsResponse;
  isAbleToPerformActions?: boolean;
}

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

const initialErrors: Errors = {
  name: '',
  externalId: '',
  description: '',
  components: '',
  samplingPointId: '',
};

const DeviceDetail: React.FC<DeviceDetailProps> = ({ device: foundDevice, samplingPoints, type, isAbleToPerformActions }) => {
  const initialData: Data = {
    create: {
      name: '',
      externalId: '',
      description: '',
      components: '',
      samplingPointId: null,
    },
    update: {
      name: foundDevice?.name || '',
      externalId: foundDevice?.externalId || '',
      description: foundDevice?.description || '',
      components: foundDevice?.components || '',
      samplingPointId: foundDevice?.samplingPoint?.id,
    },
  }[type];

  const user = useAuthenticatedUser();
  const isDeviceOwner = user?.id === foundDevice?.owner.id;

  const [data, setData] = React.useReducer(reducer, initialData);
  const [errors, setErrors] = React.useState<Errors>(initialErrors);
  const [showModal, setShowModal] = useState(false);
  const [showDeviceApiKeyModal, setShowDeviceApiKeyModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmitCreate = async () => {

    const errors = checkErrors(deviceSchema, data, initialErrors);

    if (Object.values(errors).some((error) => error !== '')) {
      setErrors(errors);
      return;
    }

    try {
      await axios.post('/api/devices', {
        ...data,
      });
      setSuccessMessage('Módulo creado exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al crear el módulo');
    }
  };

  const handleSubmitUpdate = async () => {
    const errors = checkErrors(deviceSchema, data, initialErrors);

    if (Object.values(errors).some((error) => error !== '')) {
      setErrors(errors);
      return;
    }

    try {
      await axios.put(`/api/devices/${foundDevice?.id}`, {
        ...data,
      });
      setSuccessMessage('Módulo actualizado exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al actualizar el módulo');
    }
  };

  const handleSubmit = {
    create: handleSubmitCreate,
    update: handleSubmitUpdate,
  }[type];

  const handleDeleteDevice = async () => {
    try {
      await axios.delete(`/api/devices/${foundDevice?.id}`);
      setSuccessMessage('Módulo eliminado exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al eliminar el módulo');
    }
  }

  return (
    <form className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-8">
        {type === "update" && isAbleToPerformActions ?
          <div className='flex justify-end'>
            <Button
              onClick={handleDeleteDevice}
              variant="primary-admin"
              iconSize='xxs'
              icon={<IconTrash />}
              iconColor={'danger'}
              className={'!text-danger'}
            >
              Eliminar Módulo
            </Button>
          </div> : ''
        }
        <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 lg:space-y-0 space-y-3">
          <InputText
            label="Nombre"
            value={data.name}
            error={errors.name}
            variant='admin-2'
            disabled={type === "update" && !isAbleToPerformActions}
            onChange={(e) => {
              setData({
                type: 'name',
                payload: e.target.value,
              });
            }}
          />
          {type == "update" && (
            <>
              <InputText
                label='ID'
                variant='admin-2'
                value={foundDevice?.id}
                disabled={true}
                allWrapperClassName='w-1/5'
              />
              {isDeviceOwner &&
                <Button
                  variant='primary-admin'
                  icon={<SparklesIcon />}
                  iconSize='xxs'
                  iconColor='white'
                  onClick={() => setShowDeviceApiKeyModal(true)}
                  className='w-2/5'
                >
                  Generar Clave
                </Button>
              }
            </>
          )}
        </div>

        <div className='w-3/5 space-y-4'>
        <InputText
            label="Id del proveedor"
            value={data.externalId}
            error={errors.externalId}
            variant='admin-2'
            disabled={type === "update" && !isAbleToPerformActions}
            onChange={(e) => {
              setData({
                type: 'externalId',
                payload: e.target.value,
              });
            }}
          />
        </div>
        <div className='w-3/5 space-y-4'>
          <Select
            value={data.samplingPointId ?? null}
            variant={'admin-2'}
            disabled={type === "update" && !isAbleToPerformActions}
            onChange={(value) => {
              setData({
                type: 'samplingPointId',
                payload: value ? value as string : null,
              });
            }}
            label="Punto de toma asociado"
            error={errors.samplingPointId ?? undefined}
          >
            <Select.Option key={null} value={null}>
              {"--"}
            </Select.Option>
            {Object.values(samplingPoints).map((samplingPoint) => (
              <Select.Option key={samplingPoint.id} value={samplingPoint.id}>
                {samplingPoint.name}
              </Select.Option>
            ))}
          </Select>

          <InputText
            label="Descripción"
            variant='admin-2'
            disabled={type === "update" && !isAbleToPerformActions}
            value={data.description}
            error={errors.description}
            onChange={(e) => {
              setData({
                type: 'description',
                payload: e.target.value,
              });
            }}
            textarea
          />
        </div>

        <InputText
          label="Componentes tecnológicos utilizados"
          variant='admin-2'
          value={data.components}
          error={errors.components}
          disabled={type === "update" && !isAbleToPerformActions}
          onChange={(e) => {
            setData({
              type: 'components',
              payload: e.target.value,
            });
          }}
          textarea
        />

        {type == "update" &&
          <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 space-y-3 lg:space-y-0">
            <InputText
              label="Propietario / Owner"
              value={foundDevice?.owner.firstName + ' ' + foundDevice?.owner.lastName}
              variant='admin-2'
              disabled={true}
            />
            <InputText
              label="Organización"
              value={foundDevice?.owner.organizationName}
              variant='admin-2'
              disabled={true}
            />
            <InputText
              label="Mail de contacto"
              value={foundDevice?.owner.email}
              variant='admin-2'
              disabled={true}
            />
          </div>
        }
      </div>

      <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 space-y-3 lg:space-y-0">
        {type !== "update" || isAbleToPerformActions ?
          <>
            <Link href="/admin/modulos">
              <Button icon={<XMarkIcon />}
                iconSize="small"
                variant="secondary"
                className='w-full lg:w-32'>Cancelar</Button>
            </Link>

            <Button
              icon={<CheckIcon />}
              iconSize="small"
              className='w-full lg:w-32'
              onClick={() => handleSubmit()}
            >
              {type === 'create' ? 'Crear' : 'Confirmar'}
            </Button>
          </> :
          <Link href="/admin/modulos">
            <Button
              icon={<ArrowLeftIcon />}
              iconSize="small"
              variant="primary-admin"
              className='w-full lg:w-32'>Volver</Button>
          </Link>
        }
      </div>
      {showModal && (
        <ResponseModal
          showModal={showModal}
          message={successMessage}
          routePathname={'/admin/modulos/'}
        />
      )}
      {type == "update" && showDeviceApiKeyModal && (
        <DeviceApiKeyModal
          deviceId={foundDevice?.id ? foundDevice.id : 0}
          showModal={showDeviceApiKeyModal}
          setShowModal={setShowDeviceApiKeyModal}
        />
      )}
    </form>
  );
};

export default DeviceDetail;
