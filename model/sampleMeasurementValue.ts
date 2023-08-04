import { SampleMeasurementValue as PrismaSampleMeasurementValue } from '@prisma/client';
import { z } from 'zod';

// Define el esquema para SampleMeasurementValue
export const SampleMeasurementValueSchema = z.object({
  parameterId: z.string(),
  sampleId: z.string(),
  value: z.number(),
});

// Define el tipo para la respuesta de obtener múltiples SampleMeasurementValue
export type GetSampleMeasurementValuesResponse = PrismaSampleMeasurementValue[];

// Define el tipo para la respuesta de obtener un único SampleMeasurementValue
export type GetSampleMeasurementValueResponse = PrismaSampleMeasurementValue;

// Define el tipo para la respuesta de crear un SampleMeasurementValue
export type CreateSampleMeasurementValueResponse = PrismaSampleMeasurementValue;

// Define el tipo para la respuesta de actualizar un SampleMeasurementValue
export type UpdateSampleMeasurementValueResponse = PrismaSampleMeasurementValue;

// Define el tipo para la respuesta de eliminar un SampleMeasurementValue
export type DeleteSampleMeasurementValueResponse = PrismaSampleMeasurementValue;

// Define el tipo para la respuesta de obtener múltiples SampleMeasurementValue junto con información relacionada
export type GetSampleMeasurementValuesWithRelationsResponse = (PrismaSampleMeasurementValue & {
  sample: {
    // Propiedades de Sample que deseas incluir
  };
  sampleSamplingPoint: {
    // Propiedades de SamplingPoint que deseas incluir
  };
})[];

// Define el tipo para la respuesta de obtener un único SampleMeasurementValue junto con información relacionada
export type GetSampleMeasurementValueWithRelationsResponse = PrismaSampleMeasurementValue & {
  sample: {
    // Propiedades de Sample que deseas incluir
  };
  sampleSamplingPoint: {
    // Propiedades de SamplingPoint que deseas incluir
  };
};
