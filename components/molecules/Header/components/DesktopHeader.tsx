import React from 'react';
import { Button } from '../../Buttons/Button';
import Item, { ItemProps } from './Item';
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import { BackButton } from '../../Buttons/BackButton';
import { useRouter } from 'next/router';
import { useAuthenticatedUser } from '../../../../hooks/useAuthenticatedUser';
import Image from "next/image";

interface DesktopHeaderProps {
  items: ItemProps[];
  onLogin: () => void;
  onLogout: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  items,
  onLogin,
  onLogout,
}) => {
  const router = useRouter();
  const user = useAuthenticatedUser();
  const isLogged = !!user;
  const isHome = router.pathname === '/';

  const isLoginForDeltaEmisor = router.pathname === '/auth/mobile/login';
  if(isLoginForDeltaEmisor) {
    return (
      <div className="px-9 py-4 hidden lg:block">
        <div className="flex justify-between items-center">
          <div className='flex space-x-2'>
            <span>
              {/* Desktop logo */}
              <span className="hidden lg:block">
                <Image
                  src={'/assets/LogoText.png'}
                  alt="Delta Logo"
                  height={100}
                  width={150}
                  className="cursor-pointer"
                />
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-9 py-4 hidden lg:block">
      <div className="flex justify-between items-center">
        <div className='flex space-x-2'>
          {!isHome && <BackButton />}
          <Logo />
        </div>


        <div className="flex flex-row space-x-14 items-center">
          <div className="flex flex-row space-x-12 items-center">
            {items.map((item) => {
              return (
                <Item key={`${item.children}-${item.href}`} href={item.href}>
                  {item.children}
                </Item>
              );
            })}
          </div>

          <Button
            icon={isLogged ? <ArrowLeftOnRectangleIcon /> : <ArrowRightOnRectangleIcon />}
            iconSize="small"
            variant='quaternary'
            className='text-primary'
            iconColor='primary'
            onClick={isLogged ? onLogout : onLogin}
            size="lg"
          >
            {isLogged ? 'Cerrar sesión' : 'Iniciar sesión'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
