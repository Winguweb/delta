import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DesktopHeader, MobileHeader } from './components';
import Container from '../../organisms/Container';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import { UserRole } from '@prisma/client';

export function Header({
  onMenuOpening: handleMenuOpening,
}: {
  onMenuOpening: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const user = useAuthenticatedUser();

  const items = [
    { href: '/noticias', children: 'Noticias' },
    { href: '/sobre-nosotros', children: 'Sobre Delta' },
    { href: '/preguntas-frecuentes', children: 'Preguntas Frecuentes' },
  ];

  if (!!user) {
    let href = user.role === UserRole.PROVIDER ? '/admin/lanchas' : '/admin/sampling-points';
    items.push({ href: href, children: 'Admin' });
  }

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    handleMenuOpening();
  };

  const handleLogin = async () => {
    await router.push({ pathname: '/ingresar' });
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  if (!!user && router.asPath.includes('admin')) {
    return null;
  }

  return (
    <header>
      <Container size="lg">
        <DesktopHeader
          items={items}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <MobileHeader
          onLogin={handleLogin}
          onLogout={handleLogout}
          isMenuOpen={isMenuOpen}
          onToggle={handleToggle}
          items={items}
        />
      </Container>
    </header>
  );
}
