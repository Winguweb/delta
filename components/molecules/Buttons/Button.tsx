import classNames from 'classnames';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Text from '../Text';
import IconButton from './IconButton';

export type ButtonProps = React.PropsWithChildren<
  {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'primary-admin' ;
    size?: 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    iconClassName?: string;
    spanClassName?: string;
    icon?: ReactNode;
    rightIcon?: ReactNode;
    iconSize?: 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    alignment?: 'left' | 'center' | 'right';
    padding?: string;
    iconColor?:'primary' | 'secondary' | 'black' | 'white' | 'danger';
  } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'>
>;

export const Button: React.FC<ButtonProps> = React.memo(
  ({
    className,
    children,
    icon,
    rightIcon,
    disabled = false,
    variant = 'primary',
    iconSize = 'medium',
    onClick,
    name,
    alignment = 'center',
    size = 'md',
    padding,
    iconColor,
    iconClassName,
    spanClassName,
    ...props
  }) => {
    const baseStyle = 'font-semibold flex items-center justify-center rounded-xl';

    const paddingStyle = padding ? padding : 'px-3';

    const parsedType = disabled ? `${variant}Disabled` : variant;

    const typeStyles = {
      //fill bg
      primary: 'bg-primary text-white',
      'primary-admin': 'bg-transparent text-primary',
      // only border
      secondary:
        'bg-transparent text-primary border border-solid border-primary',
      //shadow
      tertiary: 'bg-transparent shadow-md',
      //simple
      quaternary: 'bg-transparent', 
      
      primaryDisabled: 'bg-disabled text-white border-none',
      secondaryDisabled: 'bg-transparent text-disabled border border-disabled',
      tertiaryDisabled: 'bg-transparent text-disabled',
    }[parsedType] as string;

    const alignmentStyles = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[alignment] as string;

    const sizeStyles = {
      md: 'min-h-button-md',
      lg: 'min-h-button-lg',
    }[size] as string;

    const buttonClassNames = classNames([
      baseStyle,
      paddingStyle,
      typeStyles,
      sizeStyles,
      className,
    ]);

    const spanClassNames = classNames([alignmentStyles, spanClassName], 'py-3', {
      'ml-1.5': !!icon,
      'mr-1.5': !!rightIcon,
    });

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        name={name}
        className={buttonClassNames}
        {...props}
        type={props.type ?? 'button'}
      >
        {icon && (
          <IconButton
            asDiv
            variant={variant}
            disabled={disabled}
            iconSize={iconSize}
            iconColor={iconColor}
            icon={icon}
            className={iconClassName}
          />
        )}

        <Text as={`button-${size as 'lg' | 'md'}`} className={spanClassNames}>
          {children}
        </Text>

        {rightIcon && (
          <IconButton
            asDiv
            variant={variant}
            disabled={disabled}
            iconSize={iconSize}
            iconColor={iconColor}
            icon={rightIcon}
            className={iconClassName}
          />
        )}
      </button>
    );
  }
);
