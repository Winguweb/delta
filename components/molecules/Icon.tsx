import classNames from 'classnames';
import React, { MouseEventHandler, ReactElement, ReactNode } from 'react';

export type IconProps = {
  type?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'primary-admin'
    | 'warning';
  size?: 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl';
  disabled?: boolean;
  circle?: boolean;
  className?: string;
  label?: string;
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const Icon = React.memo<IconProps>((props) => {
  const {
    type = 'primary',
    size = 'large',
    disabled = false,
    icon,
    className,
    circle = false,
    label = '',
    onClick,
  } = props;

  const IconInner = React.cloneElement(icon as ReactElement, {
    className: 'w-full h-full',
  });

  return (
    <>
      <div
        onClick={onClick}
        className={classNames(
          className,
          'flex items-center justify-center',
          { 'w-4 h-4': size === 'xxs' },
          { 'w-5 h-5': size === 'xs' },
          { 'w-6 h-6': size === 'small' },
          { 'w-8 h-8': size === 'medium' },
          { 'w-12 h-12 ': size === 'large' },
          { 'w-16 h-16': size === 'xl' },
          { 'rounded-full': circle },
          { 'text-white !stroke-white': type === 'primary-admin' && !disabled },
          { 'text-light-gray': type === 'primary' && disabled },
          { 'text-white': type === 'tertiary' },
          { 'text-black': type === 'quaternary' },
          { 'text-warning': type === 'warning' }
        )}
      >
        {IconInner}
      </div>
      {label && (
        <div className={'pt-2 text-center text-xs text-primary'}>{label}</div>
      )}
    </>
  );
});
