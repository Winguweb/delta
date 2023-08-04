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
  return (
    <div
      className={classNames([
        'w-full pt-4 pb-4 lg:hidden bg-white',
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
        <FullScreen className="bg-white max-h-screen px-2 pt-4 space-y-8 lg:hidden">
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
