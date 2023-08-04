import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PreviewCard from '../PreviewCard';
import DetailCard from '../DetailCard';
import moment from 'moment';
import capitalize from '../../../../../utils/capitalize';
import { formatMeasurementValues } from '../../../../../utils/formatMeasurementValues';
import IconButton from '../../../../molecules/Buttons/IconButton';
import { ActiveResult, DetailModes } from '../../../../../pages/resultados';

interface ModalProps {
  detailModes: DetailModes;
  setDetailModes: React.Dispatch<React.SetStateAction<DetailModes>>;
  mapVisibility: string;
  activeResult: ActiveResult;
  setActiveResult: (x: ActiveResult | null) => void;
}

const FullDetailModal = ({ activeResult, setActiveResult, detailModes, setDetailModes }: ModalProps) => {

  const close = () => {
    setActiveResult(null);
    setDetailModes(prevModes => ({
      ...prevModes,
      showFullDetail: !detailModes.showFullDetail
    }));
  };
  


  return (
    <div className="h-full top-0 w-full left-0 flex lg:hidden flex-col absolute right-4 lg:left-1/3 lg:w-[360px] lg:top-0 z-40 max-h-screen lg:max-h-[calc(100vh_-_125px)] lg:h-fit">
      <DetailCard
        title={activeResult.name}
        tags={activeResult.areaType}
        onClose={() => close()}
        content={[
          {
            label: "Última toma",
            items: [
              {
                sampleParameters: activeResult.lastSample?.measurementValues,
                date: moment(activeResult.lastSample?.takenAt).utc().format('DD/MM/yyyy'),
                location: `${activeResult.latitude}, ${activeResult.longitude}`,
                distance: activeResult.distance ? `a ${activeResult.distance}` : 'Distancia no disponible',
                description: activeResult.description ?? '',
                owner: activeResult.owner?.organizationName ?? 'Delta',
              },
            ],
          },
          {
            label: "Histórico",
            items: activeResult.samplesResponse?.samples.map((sample:any) => ({
              sampleParameters: sample.measurementValues,
              date: moment(sample.takenAt).utc().format('DD/MM/yyyy HH:mm'),
            })),
          },
        ]}
        setDetailModes={setDetailModes}
        detailModes={detailModes}
        activeResult={activeResult}
        setActiveResult={setActiveResult}
        className={'rounded-none lg:rounded-2xl h-full bg-white'}
      />
    </div>
  );
};

const PreviewModal = ({ activeResult, detailModes, setDetailModes, mapVisibility, setActiveResult }: ModalProps) => {

  const close = () => {
    setActiveResult(null);
    setDetailModes(prevModes => ({
      ...prevModes,
      showPreview: !detailModes.showPreview
    }));
  };

  return (
    <div
      className={`${mapVisibility == 'hidden' ? 'hidden' : 'block'
        } fixed lg:block lg:top-24 top-64 right-4 left-4 lg:left-2/4 lg:w-[360px] max-h-screen h-full lg:max-h-[calc(100vh_-_125px)] lg:h-fit`}
    >
      {/* mobile */}
      <div className="block lg:hidden absolute top-2 right-2">
        <IconButton
          onClick={() => close()}
          icon={<XMarkIcon />}
          iconSize="small"
        />
      </div>
      <PreviewCard
        title={activeResult.name}
        date={moment(activeResult.lastSample?.takenAt).utc().format('DD/MM/yyyy')}
        tags={capitalize(activeResult.areaType)}
        items={formatMeasurementValues(activeResult.lastSample?.measurementValues)}
        onClick={() => setDetailModes(prevModes => ({
          ...prevModes,
          showFullDetail: true
        }))}
        maxHeight={'max-h-80 py-1 my-4'}
        className="block lg:hidden bg-white mx-auto z-30"
      />
      {/* desktop */}
      <DetailCard
        title={activeResult.name}
        tags={activeResult.areaType}
        onClose={() => close()}
        content={[
          {
            label: "Última toma",
            items: [
              {
                sampleParameters: activeResult.lastSample?.measurementValues,
                date: activeResult.lastSample ? moment(activeResult.lastSample?.takenAt).utc().format('DD/MM/yyyy') : '',
                location: `${activeResult.latitude}, ${activeResult.longitude}`,
                distance: activeResult.distance ? `a ${activeResult.distance}` : 'Distancia no disponible',
                description: activeResult.description ?? '',
                owner:  activeResult.owner?.organizationName ?? 'Delta',
              },
            ],
          },
          {
            label: "Histórico",
            items: activeResult.samplesResponse?.samples.map((sample:any) => ({
              sampleParameters: sample.measurementValues,
              date: moment(sample.takenAt).utc().format('DD/MM/yyyy HH:mm'),
            })),
          },
        ]}
        setDetailModes={setDetailModes}
        detailModes={detailModes}
        activeResult={activeResult}
        setActiveResult={setActiveResult}
        className={`hidden lg:block rounded-none lg:rounded-2xl bg-white`}
      />
    </div>
  );
};



const Modal = (props: ModalProps) => {
  const { detailModes } = props

  return (
    <div>
      {detailModes.showFullDetail && (
        <FullDetailModal  {...props} />
      )}
      {detailModes.showPreview && (
        <PreviewModal {...props} />
      )}
    </div>
  );
};

export default Modal;
