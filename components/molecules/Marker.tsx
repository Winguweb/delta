import React, { MouseEventHandler } from 'react';
import classNames from 'classnames';
import { IconMarker, IconUserMarker } from '../../assets/icons';
import { IconLocation } from '../../assets/icons/IconLocation';
import moment from "moment/moment";

export type MarkerProps = {
  lat: number;
  lng: number;
  className?: string;
  onClick?: MouseEventHandler;
  name?: string;
  showInfoWindow?: Boolean;
  takenAt?: Date;
};

export const Marker = React.memo<MarkerProps>(
  ({ lat, lng, className, onClick , name, showInfoWindow = false, takenAt}) => {
    return (
      <button
        className={classNames(
          className,
          'p-1 rounded-full w-25 h-25 absolute -translate-x-1/2 -translate-y-1/2'
        )}
        onClick={onClick}
      >
          {showInfoWindow && <div className='info-window'>
              <p className='window-title'>{name}</p>
              <p>hace {getTimeDifference(takenAt!)}</p>
          </div>}
          <IconMarker />
      </button>
    );
  }
);

export const LocationMarker = React.memo<MarkerProps>(
  ({ lat, lng, className, onClick }) => {
    return (
      <span
        className={classNames(
          className,
          'absolute -translate-x-1/2 -translate-y-1/2'
        )}
      >
        <IconLocation/>
      </span>
    );
  }
);

const getTimeDifference = (takenAt: Date) => {
    const now = moment();

    const duration = moment.duration(now.diff(takenAt));

    if (duration.hours() > 0) {
        return `${duration.hours()} horas`
    }
    if (duration.minutes() > 0) {
        return `${duration.minutes()} minutos`
    }
    return  `${duration.seconds()} segundos`;
}

export const UserMarker = React.memo<MarkerProps>((props) => {
  return (
    <div className={classNames('absolute -translate-x-1/2 -translate-y-1/2')}>
      <IconUserMarker />
    </div>
  );
});
