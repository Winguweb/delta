import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => (
  <Link href="/">
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
  </Link>
);

export default Logo;
