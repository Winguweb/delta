import Image from 'next/image';
import React from 'react';
import Text from '../../Text';

const MobileHeaderDescent: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3 items-start">
      <Image src="/favicon.ico" height={26} width={26} alt="Delta ícono" />

      <Text as="p2">
        Servicio de atención.
      </Text>
    </div>
  );
};

export default MobileHeaderDescent;
