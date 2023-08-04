import { IconConductividad, IconTemperatura, IconPh, IconRural, IconUrbano, IconDelta, IconIndependiente } from '../assets/icons';

export interface SampleParameters {
  [key: string]: number;
}

export const SAMPLE_PARAMETER_ICONS: Record<string, React.ReactNode> = {
  ph: <IconPh />,
  temperatura: <IconTemperatura />,
  conductividad: <IconConductividad />,
};

export const FILTERS_ICONS: Record<string, React.ReactNode> = {
  RURAL: <IconRural />,
  URBANO: <IconUrbano />,
  'Delta': <IconDelta />,
  Independiente: <IconIndependiente />,
};