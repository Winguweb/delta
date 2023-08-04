import React from 'react';
import InputText, { InputTextProps } from './InputText';

const NumberInput: React.FC<InputTextProps> = (props) => {
  return <InputText {...props} type="number" />;
};

export default NumberInput;
