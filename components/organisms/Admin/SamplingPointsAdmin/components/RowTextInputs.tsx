import classNames from 'classnames';
import React from 'react';
import InputText, { InputTextProps } from '../../../../molecules/Input/InputText';

interface RowTextInputsProps {
  inputs: (InputTextProps & {
    numberInput?: boolean;
    icon?: React.ReactNode;
  })[];
  icon?: React.ReactNode;
  className?: string;
}

export const RowTextInputs: React.FC<RowTextInputsProps> = ({
  inputs,
  icon,
  className,
}) => {
  return (
    <div className={classNames(['flex space-x-4 w-full', className])}>
      {inputs.map((input, i) => {
        return (
          <InputText
            disabled={input.disabled??false}
            rounded="lg"
            key={input.name ?? input.label ?? input.placeholder ?? `input-${i}`}
            label={input.label}
            placeholder={input.placeholder}
            icon={input.icon ?? icon ?? undefined}
            value={input.value}
            onChange={input.onChange}
            name={input.name}
            type={input.numberInput ? 'number' : 'text'}
            error={input.error}
            variant='admin'
          />
        );
      })}
    </div>
  );
};

