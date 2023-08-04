import React from 'react';
import { useAuthenticatedUser } from '../../../../../hooks/useAuthenticatedUser';
import Text from '../../../../molecules/Text';
import { SamplingPointTableItem, SamplingPointTableItemProps } from './SamplingPointTableItem';

interface SamplingPointsTableProps {
  headers: string[];
  samplingPoints: SamplingPointTableItemProps[];
}

export const SamplingPointTable: React.FC<SamplingPointsTableProps> = ({
  headers,
  samplingPoints,
}) => {
  const user = useAuthenticatedUser();

  return (
    <div className="w-full h-[34rem] lg:h-full lg:overflow-y-hidden flex flex-col space-y-2 mt-8 overflow-x-auto overflow-y-auto border-b-2 pb-2">
      <div className="flex flex-col space-y-3">
        <div className="grid grid-cols-5 gap-48 lg:gap-5 px-5">
          {headers.map((header, i) => (
            <Text
              as="p3"
              className="font-semibold"
              key={`header-${header}-${i}`}
            >
              {header}
            </Text>
          ))}
          <Text as="p3" className="font-semibold justify-self-center">
            Ver/Editar
          </Text>
          {/* {user && user.role !== 'COLLABORATOR' && (
            <Text as="p3" className="font-semibold justify-self-center mr-24 lg:mr-0">
              Borrar
            </Text>
          )} */}
        </div>
        {samplingPoints.sort((a, b) => {
          if (!user) {
            return 0;
          }

          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          const regex = /(\d+)|(\D+)/g;
          const partsA = nameA.match(regex) ?? [];
          const partsB = nameB.match(regex) ?? [];

          for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
            const partA = partsA[i] || '';
            const partB = partsB[i] || '';

            if (partA !== partB) {
              const numericComparison = Number(partA) - Number(partB);
              if (!isNaN(numericComparison)) {
                return numericComparison;
              } else {
                return partA.localeCompare(partB);
              }
            }
          }

          return 0;
        }).map((samplingPoint) => {
          return (
            <SamplingPointTableItem
              {...samplingPoint}
              key={samplingPoint.id || samplingPoint.name}
            />
          );
        })
        }
      </div>
    </div>
  );
};

