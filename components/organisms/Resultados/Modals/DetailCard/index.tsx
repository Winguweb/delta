import {
  MapPinIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import Tabs from '../../Tabs';
import Text from '../../../../molecules/Text';
import { Icon } from '../../../../molecules/Icon';
import { SAMPLE_PARAMETER_ICONS, SampleParameters } from '../../../../../config/samples';

import { GetSamplingPointResponse } from '../../../../../model/samplingPoint';
import capitalize from '../../../../../utils/capitalize';
import { Pill } from '../../../../atoms/Pill';
import { IconInfo } from '../../../../../assets/icons';
import { DetailModes } from '../../../../../model/detailModes';
import { ActiveResult } from '../../../../../model/activeResult';

export interface ContentProp {
  label: string;
  items?: ItemProps[];
}

interface DetailCardProps {
  detailModes: DetailModes;
  setDetailModes: React.Dispatch<React.SetStateAction<DetailModes>>;
  onClose?: (value: any) => void;
  activeResult: GetSamplingPointResponse;
  setActiveResult: (x: ActiveResult | null) => void;
  className?: string;
  title: string;
  tags: string;
  content: ContentProp[];
}
export interface ItemProps {
  sampleParameters: SampleParameters;
  date: string;
  location?: string | null;
  distance?: string | null;
  description?: string | string[];
  owner?: string | null;
}

export const Item: React.FC<ItemProps> = (props) => {

  const { sampleParameters, date, location, distance, description, owner } = props;

  const sampleTypes = sampleParameters && Object.keys(sampleParameters).map((sample, index) => {
    const key = Object.keys(sampleParameters)[index];

    return {
      name: key,
      value: sampleParameters[key],
      icon: SAMPLE_PARAMETER_ICONS[key.split(' ')[0].toLowerCase()] ?? <IconInfo />,
    };

  })

  return (
    <>
      <div className="w-full flex justify-between">
        <div className="my-3 ml-2 items-center w-full">
          {sampleTypes ? sampleTypes.map(sample => (
            <div key={sample.name} className="grid mb-2" style={{ gridTemplateColumns: '1fr 9fr' }}>

              <Icon
                size='small'
                icon={sample.icon}
                className='!m-0 !p-0'
              />

              <div>
                <Text as="p2" className="ml-2 py-0 font-semibold text-sm">
                  {capitalize(sample.name.split(' ')[0])} <Text as="span2" className='!font-normal'>{sample.value}</Text>
                </Text>
              </div>

            </div>
          )) : <Text as="p2">No se encontraron muestras</Text>}

          {date != '' && <Pill type="tertiary" className={'inline-block my-4'}>
            {date}
          </Pill>}


          {location &&
            <div className='my-2 '>

              <Text as='p2' className='hidden lg:block text-dark-gray !font-normal'>
                Ubicación
              </Text>
              <div className='flex space-x-2' >
                <Icon
                  size="xs"
                  className='lg:hidden block icon-image'
                  icon={<MapPinIcon />}
                />
                <Text as="p2">
                  {location} <span className='font-thin'>{distance}</span>
                </Text>
              </div>
            </div>
          }

          {description &&
            <div className='my-6 w-full'>
              <Text as='p2' className='text-dark-gray !font-normal'>
                Descripción
              </Text>
              <Text
                as="p1"
                className='!font-normal'
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {description}
              </Text>
            </div>
          }

          {owner &&
            <Pill type="quaternary" className='!ml-0 !py-2'>
              <>Cargado por {owner ? owner : "No identificado"}</>
            </Pill>
          }

        </div>
      </div>
    </>
  );
};


const DetailCard: React.FC<DetailCardProps> = ({
  title,
  tags,
  content,
  className,
  activeResult,
  setActiveResult,
  onClose,
}) => {
  if (!activeResult) {
    return null;
  }

  return (
    <div
      className={`w-full flex flex-col py-4 shadow-lg px-3 bg-main-image lg:bg-none overflow-hidden ${className}`}
    >
      <div className="max-h-full lg:max-h-[calc(100vh_-_135px)] bg-white py-8 px-4 rounded-2xl overflow-auto scroll-style space-y-2">
        <div className="w-full flex justify-center lg:justify-between">
          <div className="w-full flex flex-col space-y-2">
            <Text as="h3" className="font-bold">
              {title}
            </Text>
            {tags &&
              <Pill type="secondary" className={'inline-block'}>
                {tags}
              </Pill>
            }
          </div>
          <button
            className={'w-5 text-secondary flex'}
            onClick={onClose}
          >
            <XMarkIcon />
          </button>
        </div>

        <Tabs content={content as ContentProp[]} activeResult={activeResult}
          setActiveResult={setActiveResult} />

      </div>
    </div>
  );
};

export default DetailCard;
