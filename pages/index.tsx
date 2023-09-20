import classNames from 'classnames';
import GoogleMapReact, { Bounds } from 'google-map-react';
import { computeLength, computeDistanceBetween } from 'spherical-geometry-js';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GetSamplingPointResponse } from '../model/samplingPoint';
import Text from '../components/molecules/Text';
import { Button } from '../components/molecules/Buttons/Button';
import { Marker, UserMarker } from '../components/molecules/Marker';

import { GetSamplingPointResponseWithLastSample } from './api/sampling-points';
import { Coordinates } from '../model/map';
import { MapPosition } from '../model/mapPosition';
import { isBreakOrContinueStatement } from 'typescript';
import { DemoVessel } from '../components/organisms/Demo/DemoVessel';

const USER_MARKER_ID = 'USER_MARKER_ID';

type ServerSideProps = {
  googleMapsApiKey: string;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  try {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
    }

    return {
      props: {
        googleMapsApiKey,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};


const defaultZoom = 15;

function getCurrentLocation(callback: (coords: Coordinates) => void, setError: (message: string) => void): void {
  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      const { coords } = position;
      const { latitude: lat, longitude: lng } = coords;
      callback({ lat, lng });
    },
    (error: GeolocationPositionError) =>
      // console.warn('ERROR(' + error.code + '): ' + error.message),
      setError("Debe permitir el acceso a la ubicación para usar esta función"),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}
const coordsCasa = { lat: -34.415431, lng: -58.567856 };

const getMapPosition = (coords: Coordinates | undefined): MapPosition => {
  if (coords) {
    return { coords, zoom: defaultZoom };
  }
  return { coords: coordsCasa, zoom: defaultZoom };
};


/* LANCHAS DEMO */
const path1: Coordinates[] = [
  { lat: -34.421998, lng: -58.581295 },
  { lat: -34.419751, lng: -58.579161 },
  { lat: -34.415444, lng: -58.579280 },
  { lat: -34.416704, lng: -58.568346 },
  { lat: -34.414628, lng: -58.568452 },
];

const path2: Coordinates[] = [
  { lat: -34.313104, lng: -58.535992 },
  { lat: -34.340745, lng: -58.526082 },
  { lat: -34.349608, lng: -58.512456 },
  { lat: -34.353502, lng: -58.508417 },
];

const path3: Coordinates[] = [
  { lat: -34.369680, lng: -58.560115 },
  { lat: -34.354633, lng: -58.566299 },
  { lat: -34.350821, lng: -58.565215 },
  { lat: -34.349859, lng: -58.563283 },
  { lat: -34.346120, lng: -58.562118 },
  { lat: -34.343480, lng: -58.561852 },
  { lat: -34.338504, lng: -58.558888 },
  { lat: -34.334184, lng: -58.559191 },
];

const path4: Coordinates[] = [
  { lat: -34.381804, lng: -58.569876 },
  { lat: -34.381260, lng: -58.574282 },
  { lat: -34.379003268091694, lng: -58.574661857428985 },
  { lat: -34.376746256469644, lng: -58.57633304622001 },
  { lat: -34.37235744863851, lng: -58.58123266790279 },
  { lat: -34.37206363947263, lng: -58.58266640613467 },
  { lat: -34.373932103503506, lng: -58.58709811183671 },
  { lat: -34.36970081307229, lng: -58.59263175508628 },
];

const path5: Coordinates[] = [
  { lat: -34.276187055960214, lng: -58.5882318838309 },
  { lat: -34.27392738563264, lng: -58.58715185497744 },
  { lat: -34.27114543917306, lng: -58.58322238829776 },
  { lat: -34.266337278068754, lng: -58.57947068006101 },
  { lat: -34.26393759114627, lng: -58.57943928937375 },
  { lat: -34.26205670763456, lng: -58.58143259875571 },
  { lat: -34.258528316078966, lng: -58.58209180342173 },
  { lat: -34.25572625262984, lng: -58.576629821842985 },
  { lat: -34.25633596878621, lng: -58.57430691017924 },
  { lat: -34.25402680755337, lng: -58.56766777741977 },
];

const path6: Coordinates[] = [
  { lat: -34.26421407902131, lng: -58.64718739094435 },
  { lat: -34.270502962572955, lng: -58.609473688082794 },
  { lat: -34.29376600069092, lng: -58.551437707589784 },
  { lat: -34.306084152104965, lng: -58.54073308341234 },
  { lat: -34.313312963761796, lng: -58.535878335868524 },
  { lat: -34.34974108988747, lng: -58.522644385784446 },
];
/* FIN Lancha Demo */


const MapWithVehicles: NextPage<ServerSideProps> = ({ googleMapsApiKey }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const coords = coordsCasa;

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [error, setError] = useState('')
  const [bounds, setBounds] = useState<Bounds | null>(null);

  /* Lanchas Demo */
  const [posLancha1, setPosLancha1] = useState<Coordinates>(path1[0]);
  const [posLancha2, setPosLancha2] = useState<Coordinates>(path2[0]);
  const [posLancha3, setPosLancha3] = useState<Coordinates>(path3[0]);
  const [posLancha4, setPosLancha4] = useState<Coordinates>(path4[0]);
  const [posLancha5, setPosLancha5] = useState<Coordinates>(path5[0]);
  const [posLancha6, setPosLancha6] = useState<Coordinates>(path6[0]);
  /* Fin Lanchas Demo */

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (coords) {
      // Sin el setTimeout no funciona el ruteo, no pudimos encontrar el motivo
      setTimeout(() => {
        setMapPosition(getMapPosition(coords));
      }, 0);
    } else {
      getCurrentLocation((coords) => setMapPosition(getMapPosition(coords)), setError);
    }
  }, [router.isReady, coords]);


  useEffect(() => {
    Notification.requestPermission();
  }, []);




  return (
    <div className="overflow-hidden lg:overflow-visible " style={{ flexGrow: 1, display: "flex" }}>
      <Head>
        <title>Delta - Puntos de toma</title>
      </Head>

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


              <DemoVessel lat={posLancha1.lat} lng={posLancha1.lng} path={path1} name={'Lancha ABC111'} coordsCasa={coordsCasa} bounds={bounds} setter={setPosLancha1} />
              <DemoVessel lat={posLancha2.lat} lng={posLancha2.lng} path={path2} name={'Lancha DEF222'} coordsCasa={coordsCasa} bounds={bounds} setter={setPosLancha2} />
              <DemoVessel lat={posLancha3.lat} lng={posLancha3.lng} path={path3} name={'Lancha GHI333'} coordsCasa={coordsCasa} bounds={bounds} setter={setPosLancha3} />
              <DemoVessel lat={posLancha4.lat} lng={posLancha4.lng} path={path4} name={'Lancha JKL444'} coordsCasa={coordsCasa} bounds={bounds} setter={setPosLancha4} />
              <DemoVessel lat={posLancha5.lat} lng={posLancha5.lng} path={path5} name={'Lancha MNO555'} coordsCasa={coordsCasa} bounds={bounds} setter={setPosLancha5} />
              <DemoVessel lat={posLancha6.lat} lng={posLancha6.lng} path={path6} name={'Lancha PQR666'} coordsCasa={coordsCasa} bounds={bounds} setter={setPosLancha6} />

            </GoogleMapReact>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapWithVehicles;
