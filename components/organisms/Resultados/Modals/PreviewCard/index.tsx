import { EyeDropperIcon, PhoneIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { Icon } from '../../../../molecules/Icon';
import { Pill } from '../../../../atoms/Pill';
import Text from '../../../../molecules/Text';

interface ItemProps {
  icon: ReactNode;
  children: ReactNode;
}

interface PreviewCardProps {
  title: string;
  date: string;
  location?: LocationProps;
  tags?: string | null;
  items?: ItemProps[];
  selected?: boolean;
  onClick: () => void;
  className?: string;
  maxHeight?: string;
}

interface LocationProps {
  address: string;
  distance?: string;
}


const Item: React.FC<ItemProps> = ({ children, icon }) => {
  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 9fr' }}>
      <Icon size='small' icon={icon} className='!m-0 !p-0' />
      {children}
    </div>
  );
};

const PreviewCard: React.FC<PreviewCardProps> = ({
  title,
  date,
  selected,
  tags,
  items,
  onClick,
  className,
  maxHeight,
}) => {

  return (
    <div
      onClick={onClick}
      className={classNames([
        className,
        'mx-auto px-3 py-2 shadow-3xl rounded-2xl flex flex-col space-y-7 w-full cursor-pointer',
        {
          'border border-primary': selected,
        },
      ])}
    >
      <div
        className={classNames([
          'scroll-style overflow-auto w-full space-y-3 pb-4',
          maxHeight ? maxHeight : 'max-h-[514px]',
        ])}
      >
        <div className="flex flex-col mt-2 ml-2 space-y-2">
          {tags &&
            <Pill type="secondary" className={'inline-block'}>
              {tags}
            </Pill>
          }

          <div className="flex flex-col space-y-4">
            <Text as="h3">
              {title}
            </Text>
          </div>

          {items?.map((item, i) => (
            <Item key={`item-${i}`} {...item} />
          ))}{' '}

          <Pill type="tertiary" className={'inline-block'}>
            {date}
          </Pill>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
