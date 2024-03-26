import { XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import IconButton from '../molecules/Buttons/IconButton';
import useCloseOnEscape from '../../utils/useCloseOnEscape';

export type ModalProps = React.PropsWithChildren<
  {
    showModal?: boolean;
    className?: string;
    bg?: string;
    rounded?: string;
    width?: string;
    height?: string;
    onClose?: () => void;
    closeButton?: boolean;
    logo?: boolean;
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Modal: React.FC<ModalProps> = ({
  showModal,
  children,
  className,
  bg,
  rounded,
  width,
  height,
  onClose,
  closeButton,
  logo,
}) => {
  // const refOverlay = useRef(null);
  useCloseOnEscape(onClose ? onClose : () => '');
  if (!showModal) return null;

  return (
    <div
      className={classNames(className, 'modal-style ')}
      style={{ margin: '0px' }}
    // ref={refOverlay}
    // onClick={(e) => {
    //   if (e.target === refOverlay.current) {
    //     onClose?.();
    //   }
    // }}
    >
      {logo && (
        <div className="w-full flex justify-center pb-8">
          <Image
            src="/assets/LogoText.png"
            alt="Delta Logo White"
            height={58}
            width={200}
          />
        </div>
      )}
      <div
        className={`relative my-6 mx-auto rounded-xl ${width ? width : 'w-[30rem]'
          }`}
        onClick={() => { }}
      >
        <div
          className={` border-0 shadow-lg relative flex flex-col w-full outline-none focus:outline-none 
              ${bg ? bg : 'bg-ultra-light-gray'}
              ${rounded ? rounded : 'rounded-lg'}
              ${height ? height : ''}
              `}
        >
          {closeButton && (
            <div className="absolute top-2 right-2">
              <IconButton onClick={onClose} icon={<XMarkIcon />} iconSize="small" />
            </div>
          )}
          <div className="modal-children max-w-[21rem] self-center lg:max-w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
