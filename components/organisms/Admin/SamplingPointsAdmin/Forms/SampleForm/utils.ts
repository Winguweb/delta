import capitalize from '../../../../../../utils/capitalize';

export const mockMeasurementValues = {
  'pH [Unidades de pH]': 0,
  'Temperatura del Agua [°Celsius]': 0,
  'Conductividad [µs/cm]': 0,
};

export const formatName = (name: string) => {
  return capitalize(name.split(' ')[0].toLowerCase());
};
