import React, { ReactNode, useEffect, useState } from 'react';
import PreviewCard from '../../Modals/PreviewCard';
import { capitalize } from 'lodash';
import moment from 'moment';
import axios from 'axios';
import { GetSamplingPointResponseWithLastSample } from '../../../../../pages/api/sampling-points';
import { GetSamplingPointResponse } from '../../../../../model/samplingPoint';
import { DetailModes, MapPosition } from '../../../../../pages/resultados';
import Text from '../../../../molecules/Text';
import { formatMeasurementValues } from '../../../../../utils/formatMeasurementValues';
import Loading from '../../../../atoms/Loading';
import { isDesktop } from '../../../../../utils/isDesktop';



type ResultsListProps = React.PropsWithChildren<{
  results: GetSamplingPointResponseWithLastSample[];
  activeResult: GetSamplingPointResponse | null;
  mapVisibility: string;
  setMapVisibility: (x: string) => void;
  setActiveResult: (x: GetSamplingPointResponse | null) => void;
  searchLocationParam?: string | string[];
  setDetailModes: React.Dispatch<React.SetStateAction<DetailModes>>
  mapPosition?: MapPosition | null;
}>;

const ResultsList: React.FC<ResultsListProps> = (props) => {
  const {
    results,
    mapVisibility,
    setActiveResult,
    activeResult,
    setDetailModes,
    mapPosition,
  } = props;
  const [loading, setLoading] = useState(true);

  const handleDetailsClick = async (resultId: string) => {

    const selectedResultSamples = await axios.get(`/api/sampling-points/${resultId}/samples`).then((res) => res.data)

    const selectedResultDistance = await axios.get(
      `/api/sampling-points/distances?coords[lat]=${mapPosition?.coords.lat}&coords[lng]=${mapPosition?.coords.lng}&samplingPointId=${resultId}`).then((res) => res.data)


    const selectedResult: any = Object.assign({},
      {
        ...results.find((result: GetSamplingPointResponse) => result.id === resultId) ?? null,
        distance: selectedResultDistance.distance,
        samplesResponse: {
          samples: selectedResultSamples.samples,
          currentPage: selectedResultSamples.currentPage,
          totalCount: selectedResultSamples.totalCount,
          totalPages: selectedResultSamples.totalPages
        },
      })
    if (isDesktop()) {
      setDetailModes(prevModes => ({
        ...prevModes,
        showPreview: true
      }));
    } else {
      setDetailModes(prevModes => ({
        ...prevModes,
        showFullDetail: true
      }))
    }

    setActiveResult(selectedResult)

  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [loading]);

  return (
    <div
      className={`${mapVisibility == 'hidden' ? 'block' : 'hidden'
        } mt-10 lg:mt-0 lg:block bg-white w-100 h-[calc(100vh_-_255px)] lg:h-[calc(100vh_-_195px)] scroll-style overflow-auto relative `}
    >
      {loading && (
        <div className="flex justify-center p-4">
          <Loading />
        </div>
      )}
      <div className="space-y-4 my-2 lg:mx-auto lg:w-[20rem] w-full">
        {results && results.length
          ? results.map((result) => {
            return (
              <PreviewCard
                key={result.id}
                title={result.name}
                date={moment(result.lastSample?.takenAt).utc().format('DD/MM/yyyy')}
                tags={capitalize(result.areaType)}
                items={formatMeasurementValues(result.lastSample?.measurementValues)}
                selected={result.id === activeResult?.id}
                onClick={() => handleDetailsClick(result.id)}
              />
            );
          })
          : ''}
      </div>
      {!loading && results && !results.length ? (
        <div className="mt-4 p-6 lg:p-0 mx-3 lg:ml-2 text-center lg:mx-auto ">
          <Text as='p1' className="lg:w-[20rem] w-full lg:mx-auto">
            No se encontraron puntos de toma.{' '}
            <br />
            <Text as='span2'>Probá cambiar algun filtro o ajustar la zona de
              búsqueda.
            </Text>
          </Text>

        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default ResultsList;
