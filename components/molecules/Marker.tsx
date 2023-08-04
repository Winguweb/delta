import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';
import { IconMarker, IconUserMarker } from '../../assets/icons';

export type MarkerProps = {
  lat: number;
  lng: number;
  className?: string;
  onClick?: MouseEventHandler;
};

export const Marker = React.memo<MarkerProps>(
  ({ lat, lng, className, onClick }) => {
    return (
      <button
        className={classNames(
          className,
          'bg-secondary p-1 rounded-full w-25 h-25 absolute -translate-x-1/2 -translate-y-full'
        )}
        onClick={onClick}
      >
        <IconMarker/>
      </button>
    );
  }
);

export const UserMarker = React.memo<MarkerProps>((props) => {
  return (
    <div className={classNames('absolute -translate-x-1/2 -translate-y-1/2')}>
      <IconUserMarker />
    </div>
  );
});
