import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { z } from 'zod';
import checkErrors from '../../../../utils/checkErrors';
import { GetDeviceResponse } from '../../../../model/device';
import InputText from '../../../molecules/Input/InputText';
import { Button } from '../../../molecules/Buttons/Button';
import { IconTrash } from '../../../../assets/icons';
import { ResponseModal } from '../../ResponseModal';

const deviceSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido').max(100, 'El nombre puede tener un máximo de 100 caracteres'),
  description: z.string().min(3, 'La descripción es requerida').max(280, 'La descripción puede tener un máximo de 280 caracteres').optional(),
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
  description: '',
};

const LanchasDetail: React.FC<DeviceDetailProps> = ({ device: foundDevice, type, isAbleToPerformActions }) => {
  const initialData: Data = {
    create: {
      name: '',
      description: '',
    },
    update: {
      name: foundDevice?.name || '',
      description: foundDevice?.description || '',
    },
  }[type];

  const [data, setData] = React.useReducer(reducer, initialData);
  const [errors, setErrors] = React.useState<Errors>(initialErrors);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmitCreate = async () => {

    const errors = checkErrors(deviceSchema, data, initialErrors);

    if (Object.values(errors).some((error) => error !== '')) {
      setErrors(errors);
      return;
    }

    try {
      await axios.post('/api/lanchas', {
        ...data,
      });
      setSuccessMessage('Lancha creada exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al crear la lancha');
    }
  };

  const handleSubmitUpdate = async () => {
    const errors = checkErrors(deviceSchema, data, initialErrors);

    if (Object.values(errors).some((error) => error !== '')) {
      setErrors(errors);
      return;
    }

    try {
      await axios.put(`/api/lanchas/${foundDevice?.id}`, {
        ...data,
      });
      setSuccessMessage('Lancha actualizada exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al actualizar la lancha');
    }
  };

  const handleSubmit = {
    create: handleSubmitCreate,
    update: handleSubmitUpdate,
  }[type];

  const handleDeleteDevice = async () => {
    try {
      await axios.delete(`/api/lanchas/${foundDevice?.id}`);
      setSuccessMessage('Lancha eliminada exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al eliminar la lancha');
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
              Eliminar Lancha
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
            </>
          )}
        </div>

        <div className='w-3/5 space-y-4'>
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
            <Link href="/admin/lanchas">
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
          <Link href="/admin/lanchas">
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
          routePathname={'/admin/lanchas/'}
        />
      )}
    </form>
  );
};

export default LanchasDetail;
