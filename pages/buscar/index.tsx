import Head from "next/head";
import { RefObject, useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { Coordinates } from "../../model/map";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from "next";
import axiosFromServerSideProps from "../../utils/axiosFromServerSideProps";
import { isEmpty } from "lodash";
import { IconActualLocation } from "../../assets/icons";
import { GET_DYNAMIC_GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS } from "../../config/thirdParty";
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import countries from '../../utils/countries';
import { filterList } from "..";
import { Pill } from "../../components/atoms/Pill";
import Text from "../../components/molecules/Text";
import { Button } from "../../components/molecules/Buttons/Button";
import MainContainer from "../../components/organisms/MainContainer";


type ServerSideProps = {
  googleMapsApiKey: string;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const axios = await axiosFromServerSideProps(ctx);

  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }

  return {
    props: {
      googleMapsApiKey,
    },
  };
};

const SearchLocation: NextPage<ServerSideProps> = ({
                                                                      googleMapsApiKey,
                                                                    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('');
  const [locationState, setLocation] = useState('');
  const [coords, setCoords] = useState<Coordinates>({} as Coordinates);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [country, setCountry] = useState<string | undefined>('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const getCountryByUserIp = async () => {
      const response = await fetch('https://api.country.is');
      const country_location = await response.json();
      setCountry(country_location.country);
    };
    getCountryByUserIp();
  }, []);

  const { ref: autocompleteInputRef }: { ref: RefObject<HTMLInputElement> } =
    usePlacesWidget({
      apiKey: googleMapsApiKey,
      onPlaceSelected: (place) => {
        setSearchLocation(place.formatted_address);
        setLocation(place.formatted_address);
        setCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      },
      options: GET_DYNAMIC_GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS(country),
    });

  useEffect(() => {
    setIsSearchDisabled(isEmpty(locationState) || isEmpty(coords));
  }, [locationState, coords]);

  const areaTypesQueryParam = router.query.areaTypes;
  const takenByOrganizationsQueryParam = router.query.takenByOrganizations;

  const areaTypes = areaTypesQueryParam
    ? Array.isArray(areaTypesQueryParam)
      ? areaTypesQueryParam
      : [areaTypesQueryParam]
    : []
    ;

  const takenByOrganizations = takenByOrganizationsQueryParam
    ? Array.isArray(takenByOrganizationsQueryParam)
      ? takenByOrganizationsQueryParam
      : [takenByOrganizationsQueryParam]
    : []
    ;

    const filters = [...areaTypes, ...takenByOrganizations];

  const handleSearchLocationChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSearchLocation(event.currentTarget.value);
  };

  const handleSearchButtonClicked = async () => {
    if (!isSearchDisabled) {
      await router.push({
        pathname: `/resultados`,
        query: {
          coords: encodeURIComponent(JSON.stringify(coords)),
          'areaTypes': areaTypesQueryParam,
          'takenByOrganizations': takenByOrganizationsQueryParam,
        },
      });
    }
  };

  const handleSearchButtonByLocationClicked = () => {
    router.push({
      pathname: '/resultados',
      query: {
        'areaTypes': areaTypesQueryParam,
        'takenByOrganizations': takenByOrganizationsQueryParam,
      },
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keywords = params.get('keywords');
    const option = params.get('option');
    gtag('event', 'view_search_results', {
      eventCategory: 'Search',
      q_option: option,
      search_term: keywords,
    });
  }, []);

  return (
    <div className={'flex flex-wrap flex-grow content-start justify-center bg-main-image bg-white'}>
      <Head>
        <title>Delta - Buscar por Ubicación</title>
      </Head>
      <MainContainer className={'w-full h-full lg:w-3/5 lg:mx-4 mt-4 p-8 lg:flex-grow-0'}>
        <div className="w-full flex flex-col justify-center">
          <div className={'px-content pt-4 flex flex-col text-center lg:flex-row justify-center'}>
            <p className="text-gray-700 text-xs p-1 mx-3">
              Estás buscando:
            </p>
            <ul className="flex flex-wrap relative overflow-x-auto justify-center">
              {filters.length ? filters.map((filter) => (
                <li key={filter}>
                  <Pill type="primary" className={'mb-1 mr-1 inline-block'}>
                    {filter}
                  </Pill>
                </li>
              )) : filterList.map((filter) => (
                  <li key={filter.key}>
                    <Pill type="primary" className={'mb-1 mr-1 inline-block'}>
                      {filter.key}
                    </Pill>
                  </li>
                ))
              }
            </ul>

          </div>
          <div className="flex-col">
            <Text as="h2" className='text-center my-3'>¿En qué lugar?</Text>
            <p className={'w-full text-xs text-black text-center mt-2 mb-3 px-10'}>Podés buscar por ciudad, departamento o barrio. También podés buscar por el nombre o la dirección de un centro que ya conozcas.</p>
          </div>
          <div className="flex w-full justify-end">
            <GlobeAltIcon className="w-4 text-gray-600 mt-1.5 mr-1" />
            <p className="text-gray-600 text-xs mb-2 mt-4">Estas buscando en: </p>
            <button onClick={() => setShow(!show)} className={"bg-inherit text-gray-800 text-xs ml-2 mb-2 mt-4 mr-4"}>
              <div className="mx-1 flex justify-between w-full">
                {countries.map((countryData) => {
                  if (countryData.code == country) {
                    return <span key={countryData.code}>{countryData.name}</span>;
                  } else {
                    ('');
                  }
                })}
                <ChevronDownIcon className={'w-3 mt-.5 mr-1.5'} />
              </div>
            </button>
            {show && (
              <select
                onChange={(e) => (setCountry(e.target.value), setShow(!show))}
                defaultValue={country}
                className="absolute mt-8 select-style border-none p-0 scroll-style text-gray-800 text-xs mb-2 w-fit ml-2 mr-4"
                size={8}
              >
                {countries.map((countryData) => (
                  <option
                    className="p-1.5"
                    key={countryData.code}
                    value={countryData.code}
                    selected={countryData.code == country}
                  >
                    {countryData.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className={'w-full p-0 lg:p-3.5 flex text-center flex-col'}>
            <div className="mx-2 mt-4 lg:m-0">
              <input
                ref={autocompleteInputRef}
                className={
                  ' lg:max-w-2xl rounded-xl p-3 w-full border border-gray-300 focus:outline-0 mt-4'
                }
                placeholder={'Ingresá la ubicación'}
                value={searchLocation}
                onChange={handleSearchLocationChange}
              />

              <div
                className={
                  'mt-8 lg:flex lg:justify-center lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 lg:mx-8'
                }
              >
                <Button
                  className={'w-full lg:max-w-md '}
                  disabled={isSearchDisabled}
                  variant={'primary'}
                  onClick={handleSearchButtonClicked}
                >
                  Buscar
                </Button>
                <Button
                  icon={<IconActualLocation />}
                  className={'w-full lg:max-w-md'}
                  iconSize="small"
                  variant='secondary'
                  onClick={handleSearchButtonByLocationClicked}
                >
                  Buscar por mi ubicación actual
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default SearchLocation;