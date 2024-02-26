import { Coordinates } from '../model/map';

export function getCurrentLocation(callback: (coords: Coordinates) => void, setError: (message: string) => void): void {
  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      const { coords } = position;
      const { latitude: lat, longitude: lng } = coords;
      callback({ lat, lng });
    },
    (error: GeolocationPositionError) =>
      setError('Debe permitir el acceso a la ubicación para usar esta función'),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
}