import {
  ArrowLeftIcon,
  BookmarkIcon,
  MapPinIcon,
  Squares2X2Icon,
  DocumentPlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { UserRole } from '@prisma/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useState } from 'react';
import Container from '../Container';
import { Sidebar, SidebarLinkProps } from './UI/Sidebar';
import { Header } from './UI/Header';
import { MobileHeader } from './UI/MobileHeader';
import { Button } from '../../molecules/Buttons/Button';
import { IconSpeaker } from '../../../assets/icons';


let links: SidebarLinkProps[] = [
  {
    href: '/admin/sampling-points',
    text: 'Puntos de toma',
    icon: <MapPinIcon />,
    selected: false,
    restrictedTo: [UserRole.ADMIN, UserRole.COLLABORATOR],
  },
  {
    href: '/admin/modulos',
    text: 'Módulos',
    icon: <Squares2X2Icon />,
    selected: false,
    restrictedTo: [UserRole.ADMIN, UserRole.COLLABORATOR],
  },
  {
    href: '/admin/lanchas',
    text: 'Lanchas',
    icon: <MapPinIcon />,
    selected: false,
    restrictedTo: [UserRole.PROVIDER],
  },
  {
    href: '/admin/news-posts',
    text: 'Noticias',
    icon: <IconSpeaker />,
    selected: false,
    restrictedTo: [UserRole.ADMIN],
  },
  {
    href: '/admin/content',
    text: 'Contenido',
    icon: <DocumentPlusIcon />,
    selected: false,
    restrictedTo: [UserRole.ADMIN],
  },
  {
    href: '/admin/users',
    text: 'Usuarios',
    icon: <UsersIcon />,
    selected: false,
    restrictedTo: [UserRole.ADMIN],
  },
  {
    href: '/admin/changelog',
    text: 'Historial de cambios',
    icon: <BookmarkIcon />,
    selected: false,
    restrictedTo: [UserRole.ADMIN],
  },
];


const AdminLayout: React.FC<
  PropsWithChildren & {
    backButton?: boolean | { redirectTo: string };
    title?: string;
  }
> = ({ children, backButton, title }) => {
  const router = useRouter();
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);

  const handleBack = () => {
    if (backButton === true) {
      router.back();
    } else if (typeof backButton === 'object') {
      router.push(backButton.redirectTo);
    }
  };

  const handleDisableScroll = () => {
    setIsScrollDisabled(!isScrollDisabled);
  };
  const showScroll = isScrollDisabled ? 'overflow-hidden' : 'overflow-auto';


  links = links.map((link) => ({
    ...link,
    selected: router.pathname.includes(link.href),
  }));

  return (
    <>
      <Head>{title && <title>Delta Admin - {title}</title>}</Head>

      <div className={`min-h-screen flex w-full ${showScroll}`}>
        <Sidebar links={links} />
        <div className="w-full bg-ultra-light-blue">
          <Header />
          <MobileHeader onMenuOpening={handleDisableScroll} links={links} />
          <div className="bg-box-background pb-6">
            <Container>
              <div className="flex flex-col">
                {backButton && (
                  <div className="flex w-full">
                    <Button
                      variant="quaternary"
                      icon={<ArrowLeftIcon />}
                      iconSize="small"
                      onClick={handleBack}
                      iconClassName='bg-inherit'
                      padding='px-0 pb-4'
                    >
                      Volver
                    </Button>
                  </div>
                )}
                <div className="min-h-screen">{children}</div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
