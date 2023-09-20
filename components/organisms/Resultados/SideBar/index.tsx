import React from 'react';
import ResultsList from './components/ResultList';
import Toggle from './components/Toggle';
import { GetSamplingPointResponse, GetSamplingPointsResponse } from '../../../../model/samplingPoint';
import Header from './components/Header';
import { DetailModes } from '../../../../model/detailModes';
import { MapPosition } from '../../../../model/mapPosition';

interface SideBarProps {
  searchLocationParam?: string | string[];
  items: string[];
  setMapVisibility: (x: string) => void;
  mapVisibility: string;
  results: GetSamplingPointsResponse;
  setActiveResult: (x: GetSamplingPointResponse | null) => void;
  activeResult: GetSamplingPointResponse | null;
  setDetailModes: React.Dispatch<React.SetStateAction<DetailModes>>;
  mapPosition?: MapPosition | null;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const {
    activeResult,
    searchLocationParam,
    items,
    setMapVisibility,
    mapVisibility,
    results,
    setActiveResult,
    setDetailModes,
    mapPosition
  } = props;
  return (
    <>
      <div className='lg:mx-5 lg:w-[20rem] w-full'>
        <Header searchLocationParam={searchLocationParam} items={items} />
      </div>

      <Toggle
        setMapVisibility={setMapVisibility}
        mapVisibility={mapVisibility}
      />
      <ResultsList
        activeResult={activeResult}
        setActiveResult={setActiveResult}
        searchLocationParam={searchLocationParam}
        results={results}
        mapVisibility={mapVisibility}
        setMapVisibility={setMapVisibility}
        mapPosition={mapPosition}
        setDetailModes={setDetailModes}
      />
    </>
  );
};

export default SideBar;
