import classNames from 'classnames';
import GoogleMapReact, { Bounds } from 'google-map-react';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Text from '../components/molecules/Text';
import { Button } from '../components/molecules/Buttons/Button';
import { Marker, UserMarker } from '../components/molecules/Marker';

import { Coordinates } from '../model/map';
import { MapPosition } from '../model/mapPosition';
import { getCurrentLocation } from '../utils/geolocationUtils';
import { areNotificationsSupported } from '../utils/notificationsSupport';
import { IconNotification } from '../assets/icons/IconNotification';

const USER_MARKER_ID = 'USER_MARKER_ID';

type ServerSideProps = {
  googleMapsApiKey: string;
  webSocketURL: string
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  try {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const webSocketURL = process.env.WEBSOCKET_URL
    if (!googleMapsApiKey) {
      throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
    }
    if (!webSocketURL) {
      throw new Error('Environment variable not set: WEBSOCKET_URL');
    }

    return {
      props: {
        googleMapsApiKey,
        webSocketURL
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

type Boat = {
  id: number,
  coordinates: Coordinates,
  name: string
}

const MapWithVehicles: NextPage<ServerSideProps> = ({ googleMapsApiKey, webSocketURL }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const coords = coordsCasa;

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [error, setError] = useState('')
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState<Boolean>(false)

  const [boats, setBoats] = useState<Map<number, Boat>>(new Map())

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
      getCurrentLocation((coords) => setMapPosition(getMapPosition(coordsCasa)), setError);

  }, [router.isReady, coords]);


  useEffect(() => {
    const ws = new WebSocket(webSocketURL)

    ws.onmessage = (msg) => {
      const boatData = JSON.parse(msg.data);

      const boat = {id: boatData.deviceId, coordinates: { lat: boatData.latitude, lng: boatData.longitude }, name: boatData.name};

      setBoats((prev:any) => {
        return {...prev, [boat.id]: boat}
      });
    };

    if (areNotificationsSupported()) {
      Notification.requestPermission();
    }

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
              <UserMarker
                  key={USER_MARKER_ID}
                  lat={mapPosition.coords.lat}
                  lng={mapPosition.coords.lng}
              />
              {Object.values(boats).map( (boat) =>
                  <Marker
                      key={boat.id}
                      lat={boat.coordinates.lat}
                      lng={boat.coordinates.lng}
                      name={boat.name}
                      showInfoWindow={showInfoWindow}
                      onClick={() => {
                        setShowInfoWindow(!showInfoWindow)
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
