import classNames from 'classnames';
import React from 'react';

type Props = {
  children: string | JSX.Element | JSX.Element[];
  type?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Pill = React.memo<Props>((props) => {
  const { children, type, className } = props;

  return (
    <span
      className={classNames(
        'rounded-4xl',
        'py-1 px-4',
        'text-xs',
        'w-fit',
        { 'bg-ultra-light-gray text-gray-700 font-semibold': type === 'primary' },
        {
          'bg-tag-secondary text-primary font-semibold': type === 'secondary',
        },
        {
          'bg-tag-tertiary text-tertiary font-medium text-base': type === 'tertiary',
        },

        {
          'bg-tag-quaternary text-dark-gray font-medium text-xs': type === 'quaternary',
        },
        className
      )}
    >
      {children}
    </span>
  );
});
