import isNil from 'lodash/isNil';
import classNames from 'classnames';
import GoogleMapReact from 'google-map-react';
import { Marker } from './Marker';
import React, { useState } from 'react';

export type DraggableMapProps = {
  apiKey: string;
  onChildMouseDown?: () => void;
  onChildMouseUp?: () => void;
  onChildMouseMove: (key: any, childProps: any, mouse: any) => Promise<void>;
  latitude?: number;
  longitude?: number;
  onChange: ({ bounds }: { bounds: any }) => void;
};

export const DraggableMap = (props: DraggableMapProps) => {
  const [isMapDraggable, setIsMapDraggable] = useState(false);

  const {
    apiKey,
    onChildMouseDown,
    onChildMouseUp,
    onChildMouseMove,
    onChange,
    latitude,
    longitude,
  } = props;

  const handleChildMouseDown = () => {
    setIsMapDraggable(false);
    if (!isNil(onChildMouseDown)) {
      onChildMouseDown();
    }
  };
  const handleChildMouseUp = () => {
    setIsMapDraggable(true);
    if (!isNil(onChildMouseUp)) {
      onChildMouseUp();
    }
  };
  return (
    <div
      className={classNames('w-full mb-8 rounded-2xl')}
      style={{ height: '14rem' }}
    >
      {latitude && longitude && (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: apiKey,
            language: 'es',
            region: 'ar',
          }}
          options={{
            fullscreenControl: false,
            zoomControl: false,
          }}
          draggable={isMapDraggable}
          onChildMouseDown={handleChildMouseDown}
          onChildMouseUp={handleChildMouseUp}
          onChildMouseMove={onChildMouseMove}
          defaultCenter={{ lat: latitude, lng: longitude }}
          defaultZoom={17}
          resetBoundsOnResize={true}
          onChange={onChange}
        >
          <Marker lat={latitude} lng={longitude} />
        </GoogleMapReact>
      )}
    </div>
  );
};
