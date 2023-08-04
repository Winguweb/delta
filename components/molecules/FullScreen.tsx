import classNames from 'classnames';
import React from 'react';
interface FullScreenPopUpProps {
  children: React.ReactNode;
  className?: string;
  zIndex?: string;
}
const FullScreenPopUp: React.FC<FullScreenPopUpProps> = ({
  children,
  zIndex,
  className,
}) => {
  return (
    <div
      className={classNames([
        className,
        'h-full top-0 w-full left-0 flex flex-col absolute',
        zIndex ? zIndex : 'z-50',
      ])}
    >
      {children}
    </div>
  );
};

export default FullScreenPopUp;
