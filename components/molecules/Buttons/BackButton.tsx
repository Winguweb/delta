import { ArrowLeftIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from './Button';

type BackButtonProps = React.PropsWithChildren<{
  className?: string;
}>;

export const BackButton = React.memo<BackButtonProps>((props) => {
  const { className } = props;
  const router = useRouter();
  const navigateBack = () => router.back();
  return (
    <Button
      icon={<ChevronLeftIcon />}
      className='!px-0'
      variant="quaternary"
      iconSize="small"
      iconClassName={classNames(className, 'border-none')}
      onClick={navigateBack}
    />
  );
});
