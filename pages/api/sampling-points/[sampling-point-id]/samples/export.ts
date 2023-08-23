import { NextApiHandler } from 'next';
import { prismaClient } from '../../../../../server/prisma/client';
import { AsyncParser } from '@json2csv/node';
import availableMethodsHandler from '../../../../../utils/availableMethodsHandler';
import moment from 'moment';
import { SampleForExport } from '../../../../../model/sample';

const availableMethods = ['GET'];

const handler: NextApiHandler = async (req, res) => {
  if (!availableMethodsHandler(req, res, availableMethods)) {
    return;
  }

  const samplingPointId = req.query['sampling-point-id'];

  if (!samplingPointId) {
    res.status(400).json({ error: `Missing sampling point id` });
    return;
  }

  if (typeof samplingPointId !== 'string') {
    res.status(400).json({ error: `sampling point id must be a string` });
    return;
  }

  try {
    const samples: SampleForExport[] = await prismaClient.sample.findMany({
      where: {
        samplingPointId: samplingPointId,
      },
      select: {
        id: true,
        deviceId: true,
        latitude: true,
        longitude: true,
        measurementValues: {
          select: {
            parameter: {
              select: {
                name: true,
              }
            },
            value: true,
          },
        },
        takenBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        takenAt: true,
      }
    });

    const parser = new AsyncParser();
    const csv = await parser.parse(samples.map(transformSampleIntoExportFormat)).promise();

    res.setHeader('Content-Disposition', `attachment; filename=samples.csv`);
    res.setHeader('Content-Type', 'text/csv');

    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  return;
}

function transformSampleIntoExportFormat(sample: SampleForExport): any {
  let output: any = {
    id: sample.id,
    'Dispositivo (ID)': sample.deviceId,
    Latitud: sample.latitude,
    Longitud: sample.longitude,
    Responsable: `${sample.takenBy.firstName} ${sample.takenBy.lastName}`,
    "Fecha (UTC)": moment(sample.takenAt).format('DD/MM/yyyy'),
    "Hora (UTC)": moment(sample.takenAt).format('HH:mm'),
  };

  for (const measurementValue of sample.measurementValues) {
    output[measurementValue.parameter.name] = measurementValue.value;
  }

  return output;
}

export default handler;
