import axios from 'axios';
import React, { useState, useEffect } from 'react';
import RelationOnSamplingPointForm from '../../components/RelationOnSamplingPointForm';
import FormContainer from '../../components/RelationOnSamplingPointForm/components/FormContainer';
import { GetSamplingPointResponseWithSamples } from '../../../../../../pages/admin/sampling-points/[id]';
import InputText from '../../../../../molecules/Input/InputText';
import moment from 'moment';
import Select from '../../../../../molecules/Input/Select';
import Text from '../../../../../molecules/Text';
import NumberInput from '../../../../../molecules/Input/NumberInput';
import { useAuthenticatedUser } from '../../../../../../hooks/useAuthenticatedUser';
import { validationSchema } from './validationSchema';
import { Data, FormErrors } from './types';
import { formatName, mockMeasurementValues } from './utils';
import { Modal } from '../../../../Modal';
import { Button } from '../../../../../molecules/Buttons/Button';
import { ResponseModal } from '../../../../ResponseModal';
import { AlertDeleteModal } from '../../../../AlertDeleteModal';

interface SampleOnSamplingPointFormProps {
  onCancelCb?: () => void;
  type: typeof ADD_TYPE | typeof EDIT_TYPE;
  sampleOnSamplingPoint?: GetSamplingPointResponseWithSamples['samples'][0];
  samplingPoint: GetSamplingPointResponseWithSamples;
}

const ADD_TYPE = 'add';
const EDIT_TYPE = 'edit';


export const SampleForm: React.FC<SampleOnSamplingPointFormProps> = ({
  type,
  onCancelCb,
  sampleOnSamplingPoint: sample,
  samplingPoint
}) => {

  const isAdding = type === ADD_TYPE;
  const isEditing = type === EDIT_TYPE;

  const user = useAuthenticatedUser();

  const userDevices = samplingPoint.devices?.filter(device => device.owner.id === user?.id)
  const title = `${isAdding ? 'Agregar' : 'Editar'} muestra`;
  const owner = isEditing ? `${sample?.takenBy.firstName} ${sample?.takenBy.lastName}` : `${user?.firstName} ${user?.lastName}`;

  const initialData = {
    samplingPointId: samplingPoint.id,
    date: isEditing ? moment(sample?.takenAt).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD') : moment().format('YYYY-MM-DD').toString(),
    time: isEditing ? moment(sample?.takenAt).format('HH:mm') || moment().format('HH:mm') : moment().format('HH:mm'),
    latitude: isEditing ? sample?.latitude || null : null,
    longitude: isEditing ? sample?.longitude || null : null,
    deviceId: isEditing ? sample?.device.id || null : null,
    measurementValues: isEditing ? sample?.measurementValues || {} : {},
  };

  const [data, setData] = useState<Data>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidationDone, setValidationDone] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const formattedMeasurementValues = Object.keys(initialData.measurementValues).length !== 0 ? Object.fromEntries(
      Object.entries(initialData.measurementValues).map(([parameterId, value]) => [
        parameterId,
        !isNaN(value) ? value : 0,
      ])
    ) : mockMeasurementValues;
    setData((prevData) => ({
      ...prevData,
      ...initialData,
      measurementValues: formattedMeasurementValues,
    }));

  }, [sample]);

  useEffect(() => {
    if (isValidationDone) {
      if (Object.keys(errors).length === 0) {
        console.log('No hay errores');
      } else {
        console.log('Hay errores:', errors);
      }
    }
  }, [errors, isValidationDone]);

  const handleValidation = (data: Data) => {
    try {
      validationSchema.validateSync(data, { abortEarly: false });
      setErrors({});
    } catch (validationErrors: any) {
      const newErrors: FormErrors = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    } finally {
      setValidationDone(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = ['latitude', 'longitude'].includes(name) ? parseFloat(value) : value;
    setData({ ...data, [name]: numericValue });
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setData({ ...data, [name]: value });
  };

  const handleMeasurementValueChange = (parameterId: string, value: string) => {
    if (!isNaN(Number(value))) {
      setData((prevData) => ({
        ...prevData,
        measurementValues: {
          ...prevData.measurementValues,
          [parameterId]: Number(value),
        },
      }));
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setValidationDone(false);
    handleValidation(data);

    if (Object.keys(errors).length === 0 || isValidationDone) {
      try {
        const { date, time, ...restData } = data;
        const formattedTakenAt = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate();

        const samples = Array.isArray(samplingPoint.samples) ? samplingPoint.samples : [];
        const editingSample = sample ? samples.find(s => s.id === sample.id) : null;
        const updatedSamples = samples.map((s) =>
          s.id === sample?.id ? { ...restData, id: s.id } : { ...s, measurementValues: { ...s.measurementValues } }
        );
        const updatedSample = updatedSamples.find(s => s.id === editingSample?.id);

        if (isAdding) {
          await axios.post(`/api/sampling-points/${samplingPoint.id}/samples`, {
            ...restData,
            takenAt: formattedTakenAt,
          });
          setSuccessMessage('Muestra creada exitosamente.');
          setShowModal(true);
        } else if (editingSample) {
          await axios.put(`/api/sampling-points/${samplingPoint.id}/samples/${editingSample.id}`, { ...updatedSample, takenAt: formattedTakenAt, });
          setSuccessMessage('Muestra actualizada exitosamente.');
          setShowModal(true);
        }

      } catch (error) {
        console.error(error);
        window.alert(`Hubo un error al ${isAdding ? 'agregar' : 'editar'} la muestra`);
      }
    }
  };

  const renderMeasurementInputs = () => {
    const measurementValues = isEditing ? data.measurementValues : mockMeasurementValues;
    return (
      <div className='flex space-x-4'>
        {Object.entries(measurementValues).map(([parameterId, value]) => (
          <NumberInput
            name={`measurementValues.${parameterId}`}
            key={parameterId}
            defaultValue={value}
            onChange={(e) => handleMeasurementValueChange(parameterId, e.target.value)}
            label={formatName(parameterId)}
            placeholder={formatName(parameterId)}
            variant='admin'
          />
        ))}
      </div>
    );
  };

  const handleDeleteSample = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteSample = async () => {
    setShowDeleteModal(false);
    try {
      await axios.delete(`/api/sampling-points/${samplingPoint.id}/samples/${sample?.id}`);
      setSuccessMessage('Muestra eliminada exitosamente.');
      setShowModal(true);
    } catch (error) {
      window.alert('Error al eliminar la muestra');
    }
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <RelationOnSamplingPointForm
      isEditing={isEditing}
      title={title}
      onDelete={handleDeleteSample}
      onSubmit={handleSubmit}
      disabled={!userDevices.length}
      onCancelCb={onCancelCb}
    >
      <FormContainer className="flex flex-col space-y-3 w-full">
        <div className='flex space-x-4'>
          {isEditing &&
            <InputText
              variant={'admin'}
              defaultValue={sample?.id}
              placeholder="Id"
              label="Id"
              disabled={true}
            />
          }
          <div className='w-full space-y-2'>
            <InputText
              variant={'admin'}
              type='date'
              onChange={handleChange}
              name="date"
              value={data.date ?? ''}
              placeholder="Fecha"
              label="Fecha"
            />
            {errors.date && <Text as='p3' className='ml-2 text-danger'>{errors.date}</Text>}
          </div>
          <div className='w-full space-y-2'>
            <InputText
              variant={'admin'}
              type='time'
              onChange={handleChange}
              name="time"
              defaultValue={data.time ?? ''}
              placeholder="Hora"
              label="Hora"
            />
            {errors.time && <Text as='p3' className='ml-2 text-danger'>{errors.time}</Text>}
          </div>
        </div>
        <div className='flex space-x-4'>
          <div className='w-full space-y-2'>
            <NumberInput
              variant={'admin'}
              onChange={handleChange}
              name="latitude"
              value={data.latitude ?? ''}
              placeholder="Latitud"
              label="Latitud"
            />
            {errors.latitude && <Text as='p3' className='ml-2 text-danger'>{errors.latitude}</Text>}
          </div>
          <div className='w-full space-y-2'>
            <NumberInput
              variant={'admin'}
              onChange={handleChange}
              name="longitude"
              value={data.longitude ?? ''}
              placeholder="Longitud"
              label="Longitud"
            />
            {errors.longitude && <Text as='p3' className='ml-2 text-danger'>{errors.longitude}</Text>}
          </div>
        </div>

        <Select
          label='Módulo utilizado'
          value={data.deviceId}
          onChange={(value) => handleSelectChange('deviceId', parseFloat(value as string))}
          placeholder={'Módulo'}
          variant={'admin'}
          disabled={!userDevices.length}
        >
          {userDevices.map((device) => (
            <Select.Option value={device.id} key={device.id}>
              {device.id}
            </Select.Option>
          ))}
        </Select>

        {!userDevices.length &&
          <Text as='p3' className='ml-2 text-danger'>Usted no es dueño de ningún módulo relacionado a este punto de toma. <b>No será posible cargar la muestra</b> </Text>
        }
        {errors.deviceId && <Text as='p3' className='ml-2 text-danger'>{errors.deviceId}</Text>}
        {renderMeasurementInputs()}
        <InputText
          variant={'admin'}
          disabled={true}
          defaultValue={owner}
          placeholder="Nombre y apellido"
          label="Responsable"
        />
        {showDeleteModal && (
          <AlertDeleteModal
            showModal={showDeleteModal}
            message={`Se eliminará la muestra con ID: ${sample?.id}`}
            onCancel={onCancelDelete}
            onConfirm={confirmDeleteSample}
          />
        )}
        {showModal && (
          <ResponseModal
            showModal={showModal}
            message={successMessage}
            routePathname={`/admin/sampling-points/${samplingPoint.id}?addSample=false`}
          />
        )}
      </FormContainer>
    </RelationOnSamplingPointForm >
  );
};
