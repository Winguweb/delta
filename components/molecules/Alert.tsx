import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

const Alert = (props: {
  title: string;
  message: string;
  success?: boolean;
}) => {
  const { title, message, success } = props;
  return (
    <div
      className={classNames(
        { '!outline-green-600': success },
        'outline outline-1 outline-orange-600 rounded-xl flex flex-col p-4'
      )}
    >
      <div className={'flex pb-2'}>
        <ExclamationCircleIcon
          className={classNames(
            { '!text-green-600': success },
            `h-6 w-5 mr-4 text-orange-600`
          )}
        />
        <p
          className={classNames(
            { '!text-green-600': success },
            `text-orange-600`
          )}
        >
          {title}
        </p>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
