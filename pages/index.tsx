import axios from 'axios';
import classNames from 'classnames';
import GoogleMapReact, { Bounds } from 'google-map-react';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Text from '../components/molecules/Text';
import { Button } from '../components/molecules/Buttons/Button';
import { Marker, UserMarker } from '../components/molecules/Marker';

import { Coordinates } from '../model/map';
import { MapPosition } from '../model/mapPosition';
import { getCurrentLocation } from '../utils/geolocationUtils';
import { IconNotification } from '../assets/icons/IconNotification';

const USER_MARKER_ID = 'USER_MARKER_ID';

type ServerSideProps = {
  googleMapsApiKey: string;
  webSocketURL: string
  currentBoats: Map<number, Boat>;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx,
) => {
  try {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const webSocketURL = process.env.WEBSOCKET_URL;
    const currentBoats = await fetchBoats(process.env.BASE_URL);

    if (!googleMapsApiKey) {
      throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
    }
    if (!webSocketURL) {
      throw new Error('Environment variable not set: WEBSOCKET_URL');
    }

    return {
      props: {
        googleMapsApiKey,
        webSocketURL,
        currentBoats,
      },
    };
  } catch (e) {
    console.error(e);
    throw new Error('Environment variables not found')
  }
};


const defaultZoom = 15;

const coordsCasa = { lat: -34.415431, lng: -58.567856 };

const getMapPosition = (coords: Coordinates | undefined): MapPosition => {
  if (coords) {
    return { coords, zoom: defaultZoom };
  }
  return { coords: coordsCasa, zoom: defaultZoom };
};

const parseBoat = (deviceSample: any): Boat => {
  return {
    id: deviceSample.deviceId,
    coordinates: { lat: deviceSample.latitude, lng: deviceSample.longitude },
    name: deviceSample.name,
    takenAt: moment(deviceSample.takenAt, 'YYYY-MM-DD HH:mm'),
  };
};

const fetchBoats = async (baseUrl: any) => {
  const data = await axios.get(`${baseUrl}/api/external-samples?lastHour=true`, {});
  return JSON.parse(JSON.stringify(
    data.data.samples.map((sample: any) => parseBoat({ ...sample, name: sample.device.name }))));
};

type Boat = {
  id: number,
  coordinates: Coordinates,
  name: string,
  takenAt: any
}

const MapWithVehicles: NextPage<ServerSideProps> = ({
                                                      googleMapsApiKey,
                                                      webSocketURL,
                                                      currentBoats,
                                                    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const coords = coordsCasa;

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [error, setError] = useState('')
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState<Boolean>(false)
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const [boats, setBoats] = useState<Map<number, Boat>>(currentBoats);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    getCurrentLocation((coords) => {
      setMapPosition(getMapPosition(coords));
      setUserLocation(coords)
    }, (_m) => {
      setMapPosition({coords: coordsCasa, zoom: defaultZoom})
    });

  }, [router.isReady, coords]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newBoats = await fetchBoats("")
      setBoats(newBoats)
    }, 20000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const ws = new WebSocket(webSocketURL)

    ws.onmessage = (msg) => {
      const boat = parseBoat(JSON.parse(msg.data));

      setBoats((prev:any) => {
        return {...prev, [boat.id]: boat}
      });
    };

    return () => {
      ws.close()
    }
  }, []);




  return (
    <div className="overflow-hidden lg:overflow-visible " style={{ flexGrow: 1, display: "flex" }}>
      <Head>
        <title>Delta - Puntos de toma</title>
      </Head>

      <Link href="/notificaciones"className="fixed lg:bottom-8 lg:right-8 bottom-4 right-1 m-4 z-40">
        <div  className="bg-white rounded-full p-5 shadow-lg hover:shadow-xl">
          <IconNotification/>
        </div>
      </Link>

      {error !== '' &&
        <div className="w-full flex flex-col items-center">
          <Text as='p1' className='text-center m-6'>{error}</Text>
          <Link href="/">
            <Button variant="secondary" className='w-48'>Volver al inicio</Button>
          </Link>
        </div>
      }

      {mapPosition && (
        <div className={'flex bg-gray-50 lg:bg-white'} style={{ flexGrow: 1 }}>


          <div
            className={classNames(
              `block lg:mt-0 lg:block w-full lg:map-desktop-height map-mobile-height lg:mx-auto rounded-t-3xl lg:rounded-t-none overflow-hidden shadow-main lg:shadow-none`
            )}
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: googleMapsApiKey,
                language: 'es',
                region: 'ar',
              }}
              options={{
                fullscreenControl: false,
                zoomControl: false,
                draggableCursor: 'default',
              }}
              defaultCenter={mapPosition.coords}
              defaultZoom={mapPosition.zoom}
              onChange={({ bounds }) => {
                setBounds(bounds);
              }}

            >
              {userLocation && (<UserMarker
                key={USER_MARKER_ID}
                lat={userLocation.lat}
                lng={userLocation.lng}
              />)}
              {Object.values(boats).map((boat) =>
                <Marker
                  key={boat.id}
                  lat={boat.coordinates.lat}
                  lng={boat.coordinates.lng}
                  name={boat.name}
                  takenAt={boat.takenAt}
                  showInfoWindow={showInfoWindow}
                  onClick={() => {
                    setShowInfoWindow(!showInfoWindow);
                  }}
                />)}
            </GoogleMapReact>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapWithVehicles;
