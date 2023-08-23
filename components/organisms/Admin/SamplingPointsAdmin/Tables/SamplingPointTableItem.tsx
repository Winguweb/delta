
import { AreaType, User, UserRole, WaterBodyType } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { useAuthenticatedUser } from '../../../../../hooks/useAuthenticatedUser';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import IconButton from '../../../../molecules/Buttons/IconButton';
import Text from '../../../../molecules/Text';
import { IconPencil } from '../../../../../assets/icons';

export interface SamplingPointTableItemProps {
  name: string;
  id: string;
  country: string,
  waterBodyType: WaterBodyType;
  areaType: AreaType;
  isUserOwner: boolean;
}

interface SamplingPointTableItemWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const SamplingPointTableItemWrapper: React.FC<
SamplingPointTableItemWrapperProps
> = ({ children, className }) => {
  const cols = React.Children.count(children);

  return (
    <div
      className={classNames([
        `w-fit lg:w-full bg-white py-4 px-2 rounded-2xl grid grid-cols-${cols} gap-48 lg:gap-5 items-center`,
        className,
      ])}
    >
      {children}
    </div>
  );
};

export const SamplingPointTableItem: React.FC<SamplingPointTableItemProps> = ({
  id,
  name,
  country,
  waterBodyType,
  areaType,
  isUserOwner
}) => {
  const user = useAuthenticatedUser();
  const isUserAdmin = user?.role === UserRole.ADMIN;
  return (
    <SamplingPointTableItemWrapper>
      <Text as="p2" className="font-semibold">
        {name}
      </Text>

      <Text as="p2">{country ?? '-'}</Text>

      <Text as="p2">{waterBodyType ?? '-'}</Text>

      <Text as="p2">{areaType ?? '-'}</Text>

      <Link href={`/admin/sampling-points/${id}`} className="w-full flex justify-center">
        <IconButton
          icon={isUserOwner  || isUserAdmin ? <IconPencil /> : <EyeIcon />}
          variant="primary-admin"
          iconSize="xxs"
          className="justify-self-center"
        />
      </Link>

    </SamplingPointTableItemWrapper>
  );
};

