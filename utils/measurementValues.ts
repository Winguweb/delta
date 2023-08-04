import { Prisma } from "@prisma/client";


export function transformMeasurementValuesForOutput(measurementValues: any[]): Record<string, number> {
  let measurementValuesForOutput = {};
  for (let measurementValue of measurementValues) {
    measurementValuesForOutput = {
      ...measurementValuesForOutput,
      [measurementValue.parameter.name]: measurementValue.value,
    }
  }
  return measurementValuesForOutput;
}

export function transformMeasurementValuesForPrisma(measurementValues: Record<string, number>): Prisma.SampleMeasurementValueCreateWithoutSampleInput[] {
  let measurementValuesForPrisma: Prisma.SampleMeasurementValueCreateWithoutSampleInput[] = [];
  for (let key in measurementValues) {
    measurementValuesForPrisma.push({
      parameter: {
        connect: {
          name: key,
        }
      },
      value: measurementValues[key],
    });
  }
  return measurementValuesForPrisma;
}
