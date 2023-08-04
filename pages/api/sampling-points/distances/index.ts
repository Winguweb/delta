import {NextApiHandler} from "next";
import {z} from "zod";
import axios from "axios";
import convert from "convert-units";
import { prismaClient } from "../../../../server/prisma/client";

const queryParamsSchema = z.object({
  coords: z.object({
    lat: z.string().refine(value => !isNaN(parseFloat(value)), {
      message: 'Expected number, received string',
    }).transform(value => parseFloat(value)),
    lng: z.string().refine(value => !isNaN(parseFloat(value)), {
      message: 'Expected number, received string',
    }).transform(value => parseFloat(value)),
  }),
  samplingPointId: z.string().uuid(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const queryPreParse: Record<string, any> = { ...req.query };
  queryPreParse.coords = {
    lat: req.query['coords[lat]'],
    lng: req.query['coords[lng]'],
  };

  delete queryPreParse['coords[lat]'];
  delete queryPreParse['coords[lng]'];

  const queryParse = queryParamsSchema.safeParse(queryPreParse);
  if (!queryParse.success) {
    return res.status(400).send(queryParse.error.message);
  }
  const queryData = queryParse.data;

  const samplingPoint = await prismaClient.samplingPoint.findUnique({
    where: {
      id: queryData.samplingPointId,
    },
  });

  if (!samplingPoint) {
    return res.status(404).json({ error: 'Sampling point not found' });
  }


  let distance = null;

  if (process.env.USE_MAPBOX_DISTANCE === 'true') {
    const mapBoxResponse = await axios.get(`https://api.mapbox.com/directions-matrix/v1/mapbox/walking/${queryData.coords.lng},${queryData.coords.lat};${samplingPoint.longitude},${samplingPoint.latitude}?access_token=${process.env.MAPBOX_TOKEN}&sources=0&annotations=distance`);
    const meters = mapBoxResponse.data?.distances?.[0]?.[1] ?? null;
    if (meters) {
      const conversion = convert(meters).from('m').toBest();
      distance = `${Math.round(conversion.val * 10) / 10}${conversion.unit}`
    }
  } else {
    const googleMapsResponse = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${queryData.coords.lat},${queryData.coords.lng}&destinations=${samplingPoint.latitude},${samplingPoint.longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}&mode=walking`);
    // Google Maps already formats the distance.
    distance = googleMapsResponse.data?.rows[0]?.elements[0]?.distance?.text ?? null;
    if (!distance) console.error(googleMapsResponse?.data);
  }



  return res.status(200).json({distance})
};

export default handler;
