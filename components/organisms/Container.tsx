import classNames from 'classnames';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'md' | 'lg';
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  size = 'md',
  children,
  className,
}) => {
  const maxW = {
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
  }[size];

  return (
    <div className={classNames([className, 'mx-auto px-6 lg:px-8', maxW])}>
      {children}
    </div>
  );
};

export default Container;
