import Image from 'next/image';
import React from 'react';
import Text from '../../Text';

const MobileHeaderDescent: React.FC = () => {
  return (
    <div className="w-full flex justify-center ">
      <div className='flex-col'>
        <Image src="/favicon.ico" height={26} width={26} alt="Delta ícono" className='ml-5' />
        <Text as="p2">
          Delta
        </Text>
      </div>
    </div>
  );
};

export default MobileHeaderDescent;
