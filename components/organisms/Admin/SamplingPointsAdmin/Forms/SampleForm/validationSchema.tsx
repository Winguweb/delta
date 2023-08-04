import * as yup from 'yup';

export const validationSchema = yup.object().shape({
    date: yup.string().required('La fecha es requerida'),
    time: yup.string().required('La hora es requerida'),
    latitude: yup.number().required('La latitud es requerida'),
    longitude: yup.number().required('La longitud es requerida'),
    deviceId: yup.number().required('El módulo es requerido'),
    measurementValues: yup
      .object()
      .test('valid-measurement-values', 'Los valores de medición no son válidos', (value) => {
        if (!value) return true; // Permitir valores nulos (opcional)
        return Object.values(value).every((val) => !isNaN(val as number));
      }),
  });