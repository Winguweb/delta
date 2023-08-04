import { KeyIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { FILTERS_ICONS } from '../config/samples';
import MainContainer from '../components/organisms/MainContainer';
import Text from '../components/molecules/Text';
import { Button } from '../components/molecules/Buttons/Button';

interface FilterPill {
  key: string;
  name: string;
  category: string;
  icon?: ReactNode;
  selected: boolean;
}

interface SearchButtonProps {
  enabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SearchButton = React.memo<SearchButtonProps>((props: SearchButtonProps) => {
  const { enabled, onClick } = props;

  return (
    <Button className={'my-5 w-full lg:w-80 lg:mr-1 mb-5 lg:my-5'} disabled={!enabled} variant={'primary'} onClick={onClick}>
      Buscar
    </Button>
  );
});

interface SearchAllButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SearchAllButton = React.memo<SearchAllButtonProps>((props) => {
  const { onClick } = props;

  return (
    <Button
      type='button'
      className={'w-full lg:ml-1 mb-5 lg:my-5 lg:w-80 flex flex-row aling-center justify-center'}
      variant={'secondary'}
      onClick={onClick}
      icon={< Squares2X2Icon />}
      iconSize={'small'}
    >
      Explorar todos los módulos
    </Button>
  );
});

interface FilterProps {
  id?: string;
  icon?: ReactNode;
  description: string;
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FiltersButton = (props: FilterProps) => {
  const { id, icon, description, active, onClick } = props;
  return (
    <Button
      name={id}
      onClick={onClick}
      className={`w-full lg:w-80 lg:mr-2 !justify-start my-2 `}
      iconSize={'medium'}
      variant={active ? 'secondary' : 'tertiary'}
      icon={icon}
      alignment={'left'}
    >
      {description}
    </Button>
  );
};

export const filterList = [
  { key: 'Delta', name: 'Módulos de Delta', category: 'takenByOrganizations' },
  { key: 'Independiente', name: 'Módulos independientes', category: 'takenByOrganizations' },
  { key: 'URBANO', name: 'Puntos de toma urbano', category: 'areaTypes' },
  { key: 'RURAL', name: 'Puntos de toma rural', category: 'areaTypes' },
];

const Home: NextPage = React.memo(() => {
  const initialFilters: Record<string, FilterPill> = Object.fromEntries(
    filterList.map((filterData) => [
      filterData.key,
      {
        key: filterData.key,
        name: `${filterData.name}`,
        category: `${filterData.category}`,
        icon: FILTERS_ICONS[filterData.key],
        selected: false,
      },
    ]),
  );

  const [filters, setFilters] = useState(initialFilters);
  const filtersSelected = Object.values(filters).some((filter) => filter.selected);

  const toggleFilter = (filterKey: string) => {
    const filterToUpdate = filters[filterKey];
    if (!filterToUpdate) {
      return;
    }
    setFilters({
      ...filters,
      [filterToUpdate.key]: {
        ...filterToUpdate,
        selected: !filterToUpdate.selected,
      },
    });
  };
  
  const router = useRouter();

  const search = (filtersToSearch: FilterPill[]) => {

    const selectedFilters = filtersToSearch.filter((filter) => filter.selected);
    if (selectedFilters.length > 0) {
      //se crea un objeto queryFilters para almacenar los filtros agrupados por categoría
      const queryFilters: Record<string, string[]> = {};
      selectedFilters.forEach((filter) => {
        if (!queryFilters[filter.category]) {
          queryFilters[filter.category] = [];
        }
        queryFilters[filter.category].push(filter.key);
      });

      router.push({
        pathname: '/buscar',
        query: queryFilters,
      });
    }else {
      // Si no hay filtros seleccionados, simplemente redirige a la página de búsqueda sin filtros
      router.push('/buscar');
    }
  
  };

  const handleSearchAllButtonClicked = () => {    
    search(Object.values(filters));
  };

  const handleSearchButtonClicked = () => {
    search(Object.values(filters).filter((filter) => filter.selected));
  };

  return (
    <div className={'flex flex-wrap flex-grow content-start justify-center bg-main-image bg-white'}>
      <Head>
        <title>Delta</title>
      </Head>
      <MainContainer className={'w-full h-full lg:w-3/5 lg:mx-4 mt-4 pt-8 lg:flex-grow-0'}>
        <div className="w-full flex flex-col justify-center">
          <div className="flex-col">
            <Text as="h2" className='text-center'>¿Qué estás buscando?</Text>
            <p className={'text-xs text-black mt-2 text-center mb-3'}>Selecciona una o más opciones</p>
          </div>
          <div className="flex flex-col lg:flex-row flex-wrap justify-center">
            {Object.values(filters).map((filter) => (
              <FiltersButton
                key={filter.key}
                icon={FILTERS_ICONS[filter.key]}
                description={filter.name}
                active={filter.selected}
                onClick={() => toggleFilter(filter.key)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row flex-wrap justify-center">
          <SearchButton enabled={filtersSelected} onClick={handleSearchButtonClicked} />
          <SearchAllButton onClick={handleSearchAllButtonClicked} />
        </div>
      </MainContainer>
    </div>
  );
});

export default Home;
