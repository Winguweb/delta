import classNames from 'classnames';
import React from 'react';
import { Icon } from '../Icon';
import Text from '../Text';
import RequireMark from './RequireMark';

export interface InputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  error?: string | null;
  rounded?: 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  textarea?: boolean;
  variant?: 'admin' | 'admin-2';
  wrapperClassName?: string;
  labelInputWrapperClassName?: string;
  allWrapperClassName?: string;
  required?: boolean;
  marginLeft?: string;
}

const InputText: React.FC<InputTextProps> = ({
  variant,
  rounded = 'md',
  error,
  icon,
  children,
  label,
  textarea,
  className,
  wrapperClassName,
  labelInputWrapperClassName,
  allWrapperClassName,
  required,
  marginLeft,
  ...props
}) => {

  const baseStyle = (() => {
    switch (variant) {
      case 'admin':
        return 'admin-input';
      case 'admin-2':
        return 'admin-2-input';
      default:
        return 'input-style bg-white';
    }
  })();

  const baseClassName = [
    baseStyle,
    { 'border-error': error },
    { 'rounded-xl': rounded === 'lg' },
    className,
    wrapperClassName,
  ];

  return (
    <div className={classNames(['w-full', allWrapperClassName])}>
      <div
        className={classNames([
          'flex flex-col space-y-3',
          labelInputWrapperClassName,
        ])}
      >
        {required && <RequireMark marginLeft={marginLeft} />}
        {label && (
          <Text as="p2" className="font-medium ml-4">
            {label}
          </Text>
        )}
        <div className={classNames(['w-full relative', wrapperClassName])}>
          <input
            {...props}
            className={classNames([...baseClassName, { hidden: textarea }, 'truncate-placeholder'])}
          />
          <textarea
            style={{ height: 80 }}
            {...props}
            className={classNames([...baseClassName, { hidden: !textarea }])}
          />
          {icon && (
            <Icon
              icon={icon}
              size="small"
              className={classNames([
                'absolute top-2.5 right-3 text-slate-500',
                {
                  'text-light-gray': props.disabled,
                },
              ])}
            />
          )}
        </div>
      </div>

      {!!error && (
        <div className="flex space-x-2 items-center mt-1 ml-2">
          <Text as="p3" className="text-error">
            {error}
          </Text>
        </div>
      )}
    </div>
  );
};

export default InputText;
