import { GetSamplingPointResponse } from "../model/samplingPoint";

function placeInfo(data: string | number | null | undefined) {
  if (!data) return '';
  if (typeof data === 'number') return data;
  return data;
}

export function formatEstablishmentLocation(
  place: GetSamplingPointResponse
): string {
  return `${placeInfo(place.description)} ${placeInfo(
    place.description
  )}, ${placeInfo(place.description)}`;
}

export const tryGetGoogleMapsApiKey = () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY!;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }
  return googleMapsApiKey;
};
