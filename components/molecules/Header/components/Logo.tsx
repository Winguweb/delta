import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => (
  <Link href="/">
    <span>
      {/* Mobile logo */}
      <span className="block lg:hidden">
        <Image
          src={'/assets/LogoMobile.svg'}
          alt="Delta Logo"
          height={57}
          width={85}
        />
      </span>

      {/* Desktop logo */}
      <span className="hidden lg:block">
        <Image
          src={'/assets/Logo.svg'}
          alt="Delta Logo"
          height={57}
          width={85}
          className="cursor-pointer"
        />
      </span>
    </span>
  </Link>
);

export default Logo;
