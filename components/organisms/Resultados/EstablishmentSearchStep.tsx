import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import isNil from 'lodash/isNil';
import React, { useEffect, useState } from 'react';
import countries from '../../../utils/countries';
import { Button } from '../../molecules/Buttons/Button';
type EstablishmentSearchStepProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  countryApi: string | undefined;
  setCountryApi: (x: any) => void;
  onClick: () => void;
  searchLocationParam?: string | string[];
};

export const EstablishmentSearchStep = React.forwardRef<
  HTMLInputElement,
  EstablishmentSearchStepProps
>((props: EstablishmentSearchStepProps, ref) => {
  const {
    onChange,
    onClick,
    setCountryApi,
    countryApi,
    name,
    address,
    latitude,
    longitude,
    searchLocationParam,
  } = props;
  const [isValid, setIsValid] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const getCountryByUserIp = async () => {
      const response = await fetch('https://api.country.is');
      const country_location = await response.json();
      setCountryApi(country_location.country);
    };
    getCountryByUserIp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const validationFields = [name, address, latitude, longitude];
    setIsValid(validationFields.every((field) => !isNil(field)));
  }, [name, address, latitude, longitude]);

  return (
    <>
      <div className="flex w-full justify-end">
        <GlobeAltIcon className="w-4 text-gray-600 mt-1.5 mr-1" />
        <p className="text-gray-600 text-xs mb-2 mt-4">Estas buscando en: </p>
        <button
          onClick={() => setShow(!show)}
          className={'bg-inherit text-gray-800 text-xs ml-2 mb-2 mt-4'}
        >
          <div className="mx-1 flex justify-between w-full">
            {countries.map((countryData) => {
              if (countryData.code == countryApi) {
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
            onChange={(e) => (setCountryApi(e.target.value), setShow(!show))}
            defaultValue={countryApi}
            className="absolute mt-8 select-style border-none p-0 scroll-style text-gray-800 text-xs mb-2 w-fit ml-2"
            size={8}
          >
            {countries.map((countryData) => (
              <option
                className="p-1.5"
                key={countryData.code}
                value={countryData.code}
                selected={countryData.code == countryApi ? true : false}
              >
                {countryData.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <input
        name={'name'}
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'
        }
        placeholder={'Nombre del establecimiento'}
        onChange={onChange}
        value={name}
      />
      <input
        ref={ref}
        name={'address'}
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-4 mb-4'
        }
        placeholder={'Dirección del establecimiento'}
        onChange={onChange}
        value={address}
      />
      <Button
        className={'w-full my-5'}
        disabled={!isValid}
        variant={'primary'}
        onClick={onClick}
      >
        Continuar
      </Button>
    </>
  );
});
