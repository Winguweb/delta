import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { NextPage } from 'next';
import useDebounce from '../../../hooks/useDebounce';
import useFilters from '../../../hooks/useFilters';
import useQueryUpdater from '../../../hooks/useQueryUpdater';
import { GetSamplingPointsResponse } from '../../../model/samplingPoint';
import Link from 'next/link';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import Text from '../../../components/molecules/Text';
import { Button } from '../../../components/molecules/Buttons/Button';
import { RowTextInputs } from '../../../components/organisms/Admin/SamplingPointsAdmin';
import { SamplingPointTable } from '../../../components/organisms/Admin/SamplingPointsAdmin/Tables/SamplingPointTable';
import Select from '../../../components/molecules/Input/Select';
import countries from '../../../utils/countries';
import InputText from '../../../components/molecules/Input/InputText';
import { AreaType, WaterBodyType } from '@prisma/client';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';


const filterNames = [
  { key: 'name', isArray: false },
  { key: 'country', isArray: false },
  { key: 'areaTypes', isArray: false },
  { key: 'waterBodyTypes', isArray: false },
];


const SamplingPointsPage: NextPage = (props) => {
  const user = useAuthenticatedUser();

  const { filters, setFilters } = useFilters(filterNames);

  const debouncedFilters = useDebounce(filters, 700);

  const query = useQueryUpdater<GetSamplingPointsResponse>(
    `/api/sampling-points`,
    debouncedFilters
  );

  if (query.error) {
    return <h1>Ups... Error!</h1>;
  }

  return (
    <div className="bg-box-background h-screen">
      <AdminLayout title="Puntos de Toma de Muestra">
        <div className="flex flex-col space-y-5">
          <div className='flex justify-between'>

            <Text as="h3">Puntos de toma</Text>
            <Link href={`sampling-points/new`}>
              <Button variant="primary-admin" iconSize='xxs' icon={<PlusIcon />}>
                Nuevo punto de toma
              </Button>
            </Link>
          </div>


          <div className="w-full lg:w-full">
            <InputText
              name="search"
              placeholder={'Buscar por nombre...'}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value })}
              icon={<MagnifyingGlassIcon />}
              allWrapperClassName="w-full lg:w-2/3"
              value={filters.name as string}
              className='rounded-full'
            />
          </div>

          <div className='flex justify-between space-x-4 w-full'>
            <Text as='p3' className='!text-sm mt-2'>
              Fitros:
            </Text>
            <div className="w-full ">
              <Select
                value={filters.country as string}
                onChange={(value) =>
                  setFilters({ ...filters, country: value as string })}
                placeholder={'País'}
                className='!rounded-xl'
              >
                <Select.Option value={null} >
                  Todos
                </Select.Option>
                {countries.map((country) => (
                  <Select.Option value={country.name} key={country.code}>
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="w-full">
              <Select
                value={filters.areaType as string}
                onChange={(value) =>
                  setFilters({ ...filters, areaTypes: value as string })}
                placeholder={'Tipo'}
                className='!rounded-xl'
              >
                <Select.Option value={null} >
                  Todos
                </Select.Option>
                {Object.values(AreaType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="w-full">
              <Select
                value={filters.waterBodyTypes as string}
                onChange={(value) =>
                  setFilters({ ...filters, waterBodyTypes: value as string })}
                placeholder={'Cuerpo de agua'}
                className='!rounded-xl'
              >
                <Select.Option value={null} >
                  Todos
                </Select.Option>
                {Object.values(WaterBodyType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

        </div>

        {query.isValidating && <Text as="h3">Cargando...</Text>}

        {!query.isValidating && query.data && (
          <SamplingPointTable
            samplingPoints={query.data.map((samplingPoint) => {
              const isUserOwner = user?.id === samplingPoint.ownerId;
             return {
              name: samplingPoint.name,
              id: samplingPoint.id,
              country: samplingPoint.country,
              areaType: samplingPoint.areaType,
              waterBodyType: samplingPoint.waterBodyType,
              isUserOwner: isUserOwner,
            }})}
            headers={['Nombre', 'País', 'Tipo', 'Cuerpo de agua']}
          />
        )}
      </AdminLayout>
    </div>
  );
};

export default SamplingPointsPage;

