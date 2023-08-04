import classNames from 'classnames';
import React from 'react';
import { Icon } from '../Icon';
import { ButtonProps } from './Button';

type IconButtonProps = Pick<
  ButtonProps,
  'variant' | 'disabled' | 'iconSize' | 'iconColor' | 'icon' | 'onClick'
> & { asDiv?: boolean; className?: string; };

const IconButton: React.FC<IconButtonProps> = ({
  disabled,
  icon,
  iconSize,
  iconColor,
  variant: type,
  asDiv = false,
  onClick,
  className,
}) => {
  const Node = (props: any) =>
    asDiv ? <div {...props} /> : <button {...props} />;

  return (
    <Node
      onClick={onClick}
      className={classNames('w-fit h-fit p-1', {
        'rounded-full bg-primary': !disabled && (type === 'primary-admin'),
        'rounded-full bg-transparent': !disabled && (type === 'quaternary'),
        'bg-disabled rounded-full': disabled,
        '!bg-danger': !disabled && (iconColor === 'danger'),
      }, className)}
    >
      <Icon
        type={type}
        disabled={disabled}
        size={iconSize}
        icon={icon}
        className={classNames([
          { '!text-primary': (iconColor === 'primary') },
          { '!text-white': (iconColor === 'white') },
        ])}
      />
    </Node>
  );
};

export default IconButton;
