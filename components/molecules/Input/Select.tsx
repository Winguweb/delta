import {
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { HTMLProps, PropsWithChildren, useState } from 'react';
import { Icon } from '../Icon';
import Text from '../Text';
import { useClickOutsideHandler } from '../../../hooks/useClickOutsideHandler';
import RequireMark from './RequireMark';

type Value = string | number | null;
type Values = Value[];
type OptionValue = Value | Values;

interface OptionProps
  extends PropsWithChildren,
    Omit<HTMLProps<HTMLDivElement>, 'value' | 'onClick'> {
  value: Value;
  onClick?: (value: Value) => void;
  selected?: boolean;
  withCheckbox?: boolean;
}

const Option: React.FC<OptionProps> = ({
  children,
  onClick,
  value,
  selected,
  withCheckbox,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        'w-full py-3 px-6 last:rounded-b-md bg-white hover:bg-box-background flex space-x-3 items-center text-black',
        { '!bg-primary text-white' : selected && !withCheckbox },
        props.className
      )}
      onClick={() => onClick?.(value)}
    >
      {withCheckbox && (
        <input
          type="checkbox"
          onChange={() => onClick?.(value)}
          checked={selected}
        />
      )}
      <div className={classNames(
        { 'first:stroke-white' : selected && !withCheckbox,
        'first:stroke-inherit': !selected && withCheckbox},
        props.className
      )}>{children}</div>
    </div>
  );
};

export interface SelectProps extends PropsWithChildren {
  value: OptionValue;
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  variant?: string;
  className?: string;
  required?: boolean;
  marginLeft?: string;
}

const Select = ({
  children,
  onChange,
  placeholder,
  value,
  disabled,
  label,
  error,
  variant,
  className,
  required,
  marginLeft,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const items = React.Children.map(children, (children) => {
    if (React.isValidElement(children) && children.type === Option) {
      return { label: children.props.children, value: children.props.value };
    }
  });

  const selected = items?.find((item) => item.value === value)?.label;

  const ref = useClickOutsideHandler(() => setIsOpen(false));

  const isMultiple = Array.isArray(value);

  const classVariant =  (() => {
    switch (variant) {
      case 'admin':
        return 'admin-input';
      case 'admin-2':
        return 'admin-2-input';
      default:
        return 'input-style bg-white rounded-none rounded-t-md';
    }
  })();

  
  return (
    <div className="flex flex-col space-y-1 w-full">
      <div className="w-full flex flex-col space-y-3">
      {required && <RequireMark marginLeft={marginLeft} />}
        {label && (
          <Text as="p2" className="font-medium ml-4">
            {label}
          </Text>
        )}

        <div
          className={classNames([
            'relative pr-8 lg:pr-0',
            classVariant,
            {
              'rounded-b-md': !isOpen && variant !== 'admin',
              'bg-disabled': disabled,
              'cursor-pointer': !disabled,
              'border-error': error,
            },
            className,
          ])}
          onClick={!disabled ? toggle : undefined}
          ref={ref as any}
        >
          <p>
            {!isMultiple ? selected || (!isOpen && placeholder) : placeholder}
          </p>

          <Icon
            icon={isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
            className="text-light-gray absolute top-4 w-3 h-3 right-2"
          />

          {
            <div
              className={classNames(
                'absolute top-11 w-full z-10 max-h-64 overflow-auto',
                {
                  hidden: !isOpen,
                },
                className
              )}
              style={{ marginLeft: -24 }}
            >
              {placeholder && (
                <Option
                  value={null}
                  className="bg-box-background text-light-gray"
                >
                  {placeholder}
                </Option>
              )}

              {React.Children.map(children, (children) => {
                if (
                  React.isValidElement(children) &&
                  children.type === Option
                ) {
                  return React.cloneElement(children, {
                    onClick: !disabled
                      ? isMultiple
                        ? () =>
                            onChange(
                              (value as Values).includes(children.props.value)
                                ? (value as Values).filter(
                                    (item) => item !== children.props.value
                                  )
                                : [...(value as Values), children.props.value]
                            )
                        : onChange
                      : undefined,
                    value: children.props.value,
                    children: children.props.children,
                    selected: isMultiple
                      ? value.includes(children.props.value)
                      : value === children.props.value,
                    withCheckbox: isMultiple,
                  } as OptionProps);
                }

                return null;
              })}
            </div>
          }
        </div>
      </div>
      {!!error && (
        <div className="flex space-x-2 items-center">
          <Icon
            icon={<InformationCircleIcon />}
            className="text-error w-4 h-4"
          />
          <Text as="p3" className="text-error">
            {error}
          </Text>
        </div>
      )}
    </div>
  );
};

Select.Option = Option;

export default Select;
