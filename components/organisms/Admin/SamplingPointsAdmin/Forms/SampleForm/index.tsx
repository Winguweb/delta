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
import { ResponseModal } from '../../../../ResponseModal';
import { AlertDeleteModal } from '../../../../AlertDeleteModal';
import { useCalculateDistance } from '../../../../../../hooks/useCalculateDistance';

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
      setErrors((prevErrors) => ({
        ...prevErrors,
        date: '',
      }));
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

    // Validar que la fecha no sea futura
    const currentDate = moment();
    const selectedDate = moment(`${data.date} ${data.time}`, 'YYYY-MM-DD HH:mm');
    if (selectedDate.isAfter(currentDate)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        date: 'La fecha seleccionada no puede ser futura.',
      }));
      return;
    }

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

    // Define el orden deseado de los campos
    const fieldOrder = ['pH [Unidades de pH]', 'Temperatura del Agua [°Celsius]', 'Conductividad [µs/cm]'];

    // Ordena las entradas del objeto basándote en el fieldOrder
    const sortedEntries = Object.entries(measurementValues).sort((a, b) => {
      const indexA = fieldOrder.indexOf(a[0]);
      const indexB = fieldOrder.indexOf(b[0]);
      return indexA - indexB;
    });

    return (
      <div className='flex flex-col lg:flex-row lg:space-x-4 space-x-0 lg:space-y-0 space-y-2'>
        {sortedEntries.map(([parameterId, value]) => {
          return (
            <NumberInput
              name={`measurementValues.${parameterId}`}
              key={parameterId}
              defaultValue={value}
              onChange={(e) => handleMeasurementValueChange(parameterId, e.target.value)}
              label={formatName(parameterId)}
              placeholder={formatName(parameterId)}
              variant='admin'
            />
          )
        })}
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

  const mainPoint = {
    latitude: samplingPoint.latitude,
    longitude: samplingPoint.longitude,
  };

  const distance = useCalculateDistance(
    mainPoint.latitude,
    mainPoint.longitude,
    data.latitude ?? 0,
    data.longitude ?? 0
  );

  const isDistanceValid = distance <= 5;

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
        <div className='flex flex-col lg:flex-row lg:space-x-4 space-x-0 lg:space-y-0 space-y-2'>
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
            {!isDistanceValid && (
              <Text as='p3' className='ml-2 text-danger'>
                La latitud y longitud no deben superar una distancia de 5 metros del punto principal.
              </Text>
            )}
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
            routePathname={`/admin/sampling-points/${samplingPoint.id}`}
          />
        )}
      </FormContainer>
    </RelationOnSamplingPointForm >
  );
};
