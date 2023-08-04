import classNames from 'classnames';
import React, { useState } from 'react';
import { ContentProp, Item } from '../Modals/DetailCard';
import axios from 'axios';
import Pagination from '../../../molecules/Pagination';
import Text from '../../../molecules/Text';
import { ActiveResult } from '../../../../pages/resultados';

interface TabHeaderProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

interface TabsProps {
  headers?: string[];
  content?: ContentProp[];
  activeResult: ActiveResult;
  setActiveResult: (x: ActiveResult | null) => void;
}


const TabHeader: React.FC<TabHeaderProps> = ({ label, selected, onClick }) => {
  return (
    <div
      className={classNames([
        'bg-white px-4 py-3 w-1/2 text-center',
        { 'text-primary border-b-2 border-b-primary': selected },
      ])}
      onClick={onClick}
      role="button"
    >
      <Text as="p2" className="font-bold">
        {label}
      </Text>
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({ content, activeResult, setActiveResult }) => {

  const [openIndex, setOpenIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const loadNextPageSamples = async (pageNumber: number) => {
    try {
      const selectedResultSamples = await axios.get(`/api/sampling-points/${activeResult.id}/samples?page=${pageNumber}`).then((res) => res.data);
      // @ts-ignore
      setActiveResult((prevActiveResult:ActiveResult) => ({
        ...prevActiveResult,
        samplesResponse: {
          samples: selectedResultSamples.samples,
          currentPage: selectedResultSamples.currentPage,
          totalCount: selectedResultSamples.totalCount,
          totalPages: selectedResultSamples.totalPages,
        }
      }));
    } catch (error) {
      console.error("Error fetching samples:", error);
    }
  };
  

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex shadow-4xl w-full">
        {content && content.map((tab, index) => (
          <TabHeader
            key={`header-${index}`}
            selected={index === openIndex}
            onClick={() => {
              setOpenIndex(index);
            }}
            label={tab.label}
          />
        ))}
      </div>

      {content && content.map((tab, index) => {
        if (index !== openIndex) {
          return null;
        }

        return (
          <div key={`tab-content-${index}`}>
            {tab.items?.length ? tab.items.map((item, itemIndex) => (
              <Item
                key={`item-${itemIndex}`}
                sampleParameters={item.sampleParameters}
                date={item.date}
                location={item.location}
                distance={item.distance}
                description={item.description}
                owner={item.owner}
              />
            )) : <Text as="p2">No se encontraron muestras</Text>}
            {tab.label === 'Histórico' && (
              <Pagination
                setPageNumber={setCurrentPage}
                pageNumber={currentPage}
                pages={activeResult.samplesResponse?.totalPages ?? 0}
                loadNextPage={loadNextPageSamples}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
