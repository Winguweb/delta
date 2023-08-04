import { Bounds } from 'google-map-react';
import { useState } from 'react';
import { DraggableMap, DraggableMapProps } from '../../molecules/DraggableMap';

type LocationFieldProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  province: string;
  street: string;
  streetNumber: string | null;
  apartment: string | null;
  intersection: string | null;
  country: string | null;
  city: string | null;
} & Omit<DraggableMapProps, 'onChange'>;
export const LocationField = (props: LocationFieldProps) => {
  const {
    onChange,
    province,
    street,
    streetNumber,
    apartment,
    intersection,
    apiKey,
    onChildMouseMove: handleChildMouseMove,
    latitude,
    longitude,
    country,
    city,
  } = props;
  const [bounds, setBounds] = useState<Bounds | null>(null);

  return (
    <>
      <h3 className={'my-4 text-justify font-bold text-black'}>
        ¿Delta queda?
      </h3>
      <input
        name={'country'}
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0 '
        }
        placeholder={'País'}
        onChange={onChange}
        value={country || undefined}
      />
      <input
        name={'province'}
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0  mt-6'
        }
        placeholder={'Estado / Provincia'}
        onChange={onChange}
        value={province || undefined}
      />
      <input
        name={'city'}
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0  mt-6'
        }
        placeholder={'Ciudad'}
        onChange={onChange}
        value={city || undefined}
      />
      <input
        name={'street'}
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'
        }
        placeholder={'Calle'}
        onChange={onChange}
        value={street}
      />
      <div className={'flex justify-between mt-6'}>
        <input
          name={'streetNumber'}
          className={
            'rounded-lg p-3 w-full border border-light-gray focus:outline-0 max-w-[45%]'
          }
          placeholder={'Número'}
          onChange={onChange}
          value={streetNumber || undefined}
        />
        <input
          name={'apartment'}
          className={
            'rounded-lg p-3 w-full border border-light-gray focus:outline-0 max-w-[45%]'
          }
          placeholder={'Piso'}
          onChange={onChange}
          value={apartment || undefined}
        />
      </div>
      <input
        name={'intersection'}
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'
        }
        placeholder={'Entre calles'}
        onChange={onChange}
        value={intersection || undefined}
      />
      <p className={'mt-8 text-xs mb-2'}>
        Posicioná la ubicación correcta en el mapa
      </p>
      <DraggableMap
        key={'markerPosition'}
        apiKey={apiKey}
        onChildMouseMove={(key, childProps, mouse) =>
          handleChildMouseMove(key, childProps, mouse)
        }
        latitude={latitude}
        longitude={longitude}
        onChange={({ bounds }) => {
          setBounds(bounds);
        }}
      />
    </>
  );
};
