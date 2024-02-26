import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import classNames from 'classnames';
import GoogleMapReact from 'google-map-react';
import { LocationMarker } from '../components/molecules/Marker';
import { Coordinates } from '../model/map';
import { Button } from '../components/molecules/Buttons/Button';
import { IconActualLocation } from '../assets/icons';
import { SuccessModal } from '../components/organisms/Notifications/SuccessModal';
import { NotifyOrderForm } from '../components/organisms/Notifications/NotifyOrderForm';
import { getCurrentLocation } from '../utils/geolocationUtils';

export type NotifyOrderFormValues = {
  telephone: string;
  location: Coordinates;
};

type ServerSideProps = {
  googleMapsApiKey: string;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx,
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
    throw new Error('Environment variables not found');
  }
};

const schema = yup
  .object({
    telephone: yup
      .string()
      .required('Por favor escriba su número de teléfono'),
    location: yup.object({
      lat: yup.number().required('Por favor seleccione una ubicación'),
      lng: yup.number().required('Por favor seleccione una ubicación'),
    }),
  })
  .required();

const ActivateNotifications: NextPage<ServerSideProps> = ({ googleMapsApiKey }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const coordsCasa = { lat: -34.415431, lng: -58.567856 };

  const form = useForm<NotifyOrderFormValues>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getCurrentLocation((coords) => setUserLocation(coords), () => {
    });

  }, []);

  return (
    <div className={'flex bg-gray-50 lg:bg-white'} style={{ flexGrow: 1 }}>
      <div
        className={classNames(
          `block lg:mt-0 lg:block w-full  lg:mx-auto rounded-t-3xl lg:rounded-t-none overflow-hidden shadow-main lg:shadow-none`,
        )}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className="h-full flex place-content-center">
          {showMap ? (
            <>
              <Button variant="primary-admin" onClick={() => {
                map.setCenter(userLocation);
              }} className="fixed lg:right-5 right-0 m-4 z-40">
                <div className="bg-white rounded-full p-5 shadow-lg hover:shadow-xl">
                  <IconActualLocation />
                </div>
              </Button>
              <span className="z-50 relative drop-shadow-md left-1/2 top-1/2 pointer-events-none">
              <LocationMarker
                lat={coordsCasa.lat} lng={coordsCasa.lng} />
            </span>
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
                onGoogleApiLoaded={({ map }) => setMap(map)}
                yesIWantToUseGoogleMapApiInternals
                defaultCenter={userLocation ?? coordsCasa}
                draggable={true}
                defaultZoom={15}
                onChange={({ center }) => {
                  form.unregister('location');
                  setCoords(center);
                  form.register('location', { value: center });
                }}
              >
              </GoogleMapReact>
              <div
                className={'w-full lg:w-3/4 fixed bottom-0 rounded-2xl mx-auto shadow-main'}
              >
                <div className="bg-white rounded-2xl p-5 space-y-4 ">
                  <div className="lg:grid grid-cols-3">
                    <div className="flex col-span-2">
                      <input
                        type="number"
                        className="input-style placeholder-icon"
                        readOnly={true}
                        value={coords?.lat ?? 0}
                      />
                      <input
                        type="number"
                        className="input-style placeholder-icon"
                        readOnly={true}
                        value={coords?.lng ?? 0}
                      />
                    </div>
                    <Button
                      className="primary w-full"
                      onClick={() => setShowMap(false)}
                    >
                      Confirmar ubicación
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <NotifyOrderForm form={form} setShowModal={setShowModal} setShowMap={setShowMap} coords={coords} />
          )}
        </div>
        <SuccessModal showModal={showModal} />
      </div>
    </div>
  );
};

export default ActivateNotifications;
  