import React from 'react';
import Text from '../../../../molecules/Text';

interface SamplingPointDetailProps {
  title?: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}

interface SamplingPointDataProps {
  title: string;
  data: string | undefined | null;
}

export const SamplingPointData: React.FC<SamplingPointDataProps> = ({
  data,
  title,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <Text as="p2" className="text-light-gray">
        {title}
      </Text>
      <Text as="p2" className='font-semibold !text-md'>{data || '-'}</Text>
    </div>
  );
};

export const SamplingPointContainer: React.FC<SamplingPointDetailProps> = ({
  children,
  title,
  rightElement,
}) => {
  return (
    <div className="px-7 py-5 bg-white rounded-2xl flex flex-col space-y-6 relative overflow-x-auto">
      {rightElement && (
        <div className="absolute top-0 right-4">{rightElement}</div>
      )}
      {title && <Text as="h3" className='pt-8 lg:pt-0'>{title}</Text>}
      {children}
    </div>
  );
};

