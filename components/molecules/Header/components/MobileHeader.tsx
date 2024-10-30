import { Bars3Icon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React from 'react';
import Divider from '../../../atoms/Divider';
import FullScreen from '../../FullScreen';
import { ItemProps } from './Item';
import Logo from './Logo';
import MobileHeaderDescent from './MobileHeaderDescent';
import MobileMenu from './MobileMenu';
import { useRouter } from 'next/router';
import { BackButton } from '../../Buttons/BackButton';
import IconButton from '../../Buttons/IconButton';
import Image from "next/image";

interface MobileHeaderProps {
  onLogin: () => void;
  onLogout: () => void;
  onToggle: () => void;
  isMenuOpen: boolean;
  items: ItemProps[];
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onLogin,
  onLogout,
  onToggle,
  isMenuOpen,
  items,
}) => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  const isLoginForDeltaEmisor = router.pathname === '/auth/mobile/login';
  if (isLoginForDeltaEmisor) {
    /**
     * El login que se utiliza en la aplicacion para emitir tiene un flujo particular, y solo se puede acceder a él
     * sabiendo el path. Si alguien sale del flujo no se puede volver al mismo y no se va a poder loguear para emitir.
     */
    return (
      <div
        className={classNames([
          'w-full lg:hidden bg-white left-0 py-4',
          // menu cover all screen when is mobile and is open
          {'min-h-screen absolute': isMenuOpen},
        ])}
      >
        <div className={'flex justify-between'}>
          <span>
            {/* Mobile logo */}
            <span className="block lg:hidden">
              <Image
                src={'/assets/LogoText.png'}
                alt="Delta Logo"
                height={100}
                width={150}
              />
            </span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames([
        'w-full lg:hidden bg-white left-0 py-4',
        // menu cover all screen when is mobile and is open
        { 'min-h-screen absolute': isMenuOpen },
      ])}
    >
      {!isMenuOpen && (
        <div className={'flex justify-between'}>
          {!isHome && <BackButton />}
          <Logo />

          <IconButton
            icon={<Bars3Icon />}
            className='!text-black'
            iconSize="medium"
            onClick={onToggle}
          />
        </div>
      )}

      {isMenuOpen && (
        <FullScreen className="bg-white max-h-screen px-4 pt-4 space-y-8 lg:hidden">
          <MobileMenu
            items={items}
            onClose={onToggle}
            onLogin={onLogin}
            onLogout={onLogout}
          />

          <Divider />

          <MobileHeaderDescent />
        </FullScreen>
      )}
    </div>
  );
};

export default MobileHeader;
