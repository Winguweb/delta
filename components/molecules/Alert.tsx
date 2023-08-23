import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Text from './Text';

const Alert = (props: {
  message: string;
  success?: boolean;
}) => {
  const { message, success } = props;
  return (
    <div
      className={classNames(
        { '!bg-green-200': success },
        'bg-danger-secondary rounded-xl flex flex-col p-4'
      )}
    >
      <div className={'flex'}>
        <ExclamationCircleIcon
          className={classNames(
            { '!text-green-600': success },
            `h-8 w-10 mr-4 text-danger`
          )}
        />
        <Text as='p3'>{message}</Text>
      </div>
    </div>
  );
};

export default Alert;
