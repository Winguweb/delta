import Link from 'next/link';
import Text from '../../Text';

export interface ItemProps {
  href: string;
  children: React.ReactNode;
}
const Item: React.FC<ItemProps> = ({ href, children }) => {
  return (
    <Link href={href}>
        <Text as="h5">{children}</Text>
    </Link>
  );
};

export default Item;
