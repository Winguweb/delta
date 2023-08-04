import React from 'react';
import Text from '../../../../molecules/Text';
import { Pill } from '../../../../atoms/Pill';

type HeaderProps = React.PropsWithChildren<{
  items: string[];
  searchLocationParam?: string | string[];
}>;

const Header: React.FC<HeaderProps> = (props) => {
  const { items } = props;

  return (
    <div className={'bg-white lg:bg-inherit w-full'}>
      <div className="hidden lg:block px-2 my-4 ml-1 space-y-1">
        <Text as="h2" style={{lineHeight: '28px'}}>Resultados de búsqueda</Text>
      </div>
      <div className="lg:hidden flex flex-wrap w-full ml-0 relative overflow-y-auto">
          {items.map((item) => (
            <Pill
              type={'primary'}
              className={
                'w-fit flex-none flex'
              }
              key={item}
            >
              {item}
            </Pill>
          ))}
        </div>
    </div>
  );
};

export default Header;
