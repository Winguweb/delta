import axios from 'axios';
import classNames from 'classnames';
import GoogleMapReact, { Bounds } from 'google-map-react';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { GetSamplingPointResponse } from '../model/samplingPoint';
import SideBar from '../components/organisms/Resultados/SideBar';
import Text from '../components/molecules/Text';
import { Button } from '../components/molecules/Buttons/Button';
import { Marker, UserMarker } from '../components/molecules/Marker';
import Modal from '../components/organisms/Resultados/Modals/Modal';

const USER_MARKER_ID = 'USER_MARKER_ID';

type ServerSideProps = {
  googleMapsApiKey: string;
};

export type DetailModes = {
  showPreview: boolean;
  showFullDetail: boolean;
};

export type Coordinates = { lat: number; lng: number };

export type MapPosition = {
  coords: Coordinates;
  zoom: number;
};

export interface ActiveResult extends GetSamplingPointResponse {
  distance?: string;
  lastSample?: any,
	owner?:{
    organizationName: string
  }
  samplesResponse?: {
    samples: [],
    currentPage: number,
    totalCount: number,
    totalPages: number
  };
}

export const resultWithinBoundaries = (
  marker: Coordinates,
  bounds: Bounds
) => {
  const northLat = bounds.nw.lat;
  const southLat = bounds.sw.lat;
  const westLng = bounds.nw.lng;
  const eastLng = bounds.ne.lng;
  return (
    marker.lat < northLat &&
    marker.lat > southLat &&
    marker.lng > westLng &&
    marker.lng < eastLng
  );
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

const defaultCoords = { lat: -34.6989, lng: -64.7597 };
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


const getMapPosition = (coords: Coordinates | undefined): MapPosition => {
  if (coords) {
    return { coords, zoom: defaultZoom };
  }
  return { coords: defaultCoords, zoom: defaultZoom };
};

const Results: NextPage<ServerSideProps> = ({ googleMapsApiKey }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { coords: serializedCoords } = router.query;
  const coords = useMemo(
    () =>
      serializedCoords && typeof serializedCoords === 'string'
        ? JSON.parse(decodeURIComponent(serializedCoords))
        : undefined,
    [serializedCoords]
  );

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [mapVisibility, setMapVisibility] = useState('block');
  const [error, setError] = useState('')
  const [bounds, setBounds] = useState<Bounds | null>(null);

  const [detailModes, setDetailModes] = useState<DetailModes>({
    showPreview: false,
    showFullDetail: false
  });

  const [activeResult, setActiveResult] = useState<
    ActiveResult | null
  >(null);

  const areaTypesQueryParam = router.query.areaTypes;
  const takenByOrganizationsQueryParam = router.query.takenByOrganizations;

  const areaTypes = Array.isArray(areaTypesQueryParam)
    ? areaTypesQueryParam
    : areaTypesQueryParam
      ? [areaTypesQueryParam]
      : [];

  const takenByOrganizations = takenByOrganizationsQueryParam
    ? Array.isArray(takenByOrganizationsQueryParam)
      ? takenByOrganizationsQueryParam
      : [takenByOrganizationsQueryParam]
    : []
    ;

  const params = new URLSearchParams();
  params.append('lastSample', 'true');

  areaTypes.forEach(areaType => {
    params.append('areaTypes', areaType);
  });

  takenByOrganizations.forEach(takenByOrganization => {
    params.append('takenByOrganizations', takenByOrganization);
  });

  const { data: results } = useSWR(
    router.isReady ? `/api/sampling-points?${params.toString()}` : null,
    (url) => axios.get(url).then((res) => res.data)
  );

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


  const handleMarkerClick = async (resultId: string) => {

    const selectedResultSamples = await axios.get(`/api/sampling-points/${resultId}/samples`).then((res) => { return res.data })

    const selectedResultDistance = await axios.get(
      `/api/sampling-points/distances?coords[lat]=${mapPosition?.coords.lat}&coords[lng]=${mapPosition?.coords.lng}&samplingPointId=${resultId}`).then((res) => res.data)


    const selectedResult: GetSamplingPointResponse = Object.assign({},
      {
        ...results.find((result: GetSamplingPointResponse) => result.id === resultId) ?? null,
        distance: selectedResultDistance.distance,
        samplesResponse: {
          samples: selectedResultSamples.samples,
          currentPage: selectedResultSamples.currentPage,
          totalCount: selectedResultSamples.totalCount,
          totalPages: selectedResultSamples.totalPages
        },
      })

    setDetailModes(prevModes => ({
      ...prevModes,
      showPreview: true
    }));

    setActiveResult(selectedResult)

  };


  useEffect(() => {
    setMapVisibility('block');
  }, []);

  const resultsInScreen =
    results &&
    results.filter(
      (result: GetSamplingPointResponse) =>
        bounds !== null &&
        resultWithinBoundaries(
          {
            lat: result.latitude,
            lng: result.longitude,
          },
          bounds
        )
    );

  const searchLocationParam = router.query.searchLocation;


  return (
    <div className="overflow-hidden lg:overflow-visible">
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
      <div
        className={
          'relative px-0 mx-0 lg:h-[calc(100vh - 90px)] h-[calc(100vh - 90px)] bg-white'
        }
      >
        {mapPosition && (
          <div className={'flex bg-white'}>
            <div
              className={`${mapVisibility == 'hidden' ? 'relative' : 'absolute'
                } lg:relative w-full lg:w-1/3 left-0 top-0 px-content`}
            >
              <SideBar
                items={areaTypes}
                searchLocationParam={searchLocationParam}
                results={resultsInScreen}
                setMapVisibility={setMapVisibility}
                mapVisibility={mapVisibility}
                setDetailModes={setDetailModes}
                setActiveResult={setActiveResult}
                activeResult={activeResult}
                mapPosition={mapPosition}
              />
            </div>

            <div
              className={classNames(
                `${mapVisibility} mt-10 lg:mt-0 lg:block w-full lg:map-desktop-height map-mobile-height lg:mx-auto`
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

                {results &&
                  results
                    .filter(
                      (result: GetSamplingPointResponse) =>
                        bounds !== null &&
                        resultWithinBoundaries(
                          {
                            lat: result.latitude,
                            lng: result.longitude,
                          },
                          bounds
                        )
                    )
                    .map((result: GetSamplingPointResponse) => {
                      return (
                        <Marker
                          key={result.id}
                          lat={result.latitude}
                          lng={result.longitude}
                          onClick={() => handleMarkerClick(result.id)}
                        />
                      );
                    })}
              </GoogleMapReact>
            </div>
          </div>
        )}
        {activeResult !== null && (
          <Modal
            detailModes={detailModes}
            setDetailModes={setDetailModes}
            activeResult={activeResult}
            setActiveResult={setActiveResult}
            mapVisibility={mapVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default Results;
