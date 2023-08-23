import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import { Button } from '../../Buttons/Button';
import IconButton from '../../Buttons/IconButton';
import Text from '../../Text';
import { ItemProps } from './Item';
import { useAuthenticatedUser } from '../../../../hooks/useAuthenticatedUser';

interface MobileMenuProps {
  items: ItemProps[];
  onLogin: () => void;
  onLogout: () => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  items,
  onLogin,
  onLogout,
  onClose,
}) => {
  const user = useAuthenticatedUser();
  const isLogged = !!user;

  return (
    <div className="w-full lg:hidden">
      <div className={'flex justify-end'}>
        <IconButton
          icon={<XCircleIcon className="text-dark w-8 h-8" />}
          iconSize="medium"
          onClick={onClose}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-5">
          {items.map((item) => {
            return (
              <Link key={`${item.children}-${item.href}`} href={item.href} onClick={onClose}>
                <Text as="h5">{item.children}</Text>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-start">

          <Button
            icon={isLogged ? <ArrowLeftOnRectangleIcon /> : <ArrowRightOnRectangleIcon />}
            iconSize="small"
            variant='quaternary'
            size="lg"
            iconColor='primary'
            padding='0'
            className="text-primary"
            onClick={isLogged ? onLogout : onLogin}
          >
            {isLogged ? 'Cerrar sesión' : 'Iniciar sesión'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
