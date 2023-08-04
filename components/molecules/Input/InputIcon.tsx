import React from 'react';

interface InputIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

const InputIcon: React.FC<InputIconProps> = ({ children }) => {
  return (
    <div
      style={{
        margin: '.9em .2em .2em .7em',
        position: 'absolute',
        width: '1.2em',
      }}
    >
      {children}
    </div>
  );
};

export default InputIcon;
