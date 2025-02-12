import { EyeIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import useDebounce from '../../../hooks/useDebounce';
import useFilters from '../../../hooks/useFilters';
import useQueryUpdater from '../../../hooks/useQueryUpdater';
import { GetDevicesResponse, GetDevicesResponseForTable } from '../../../model/device';
import { useAuthenticatedUser } from '../../../hooks/useAuthenticatedUser';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import Text from '../../../components/molecules/Text';
import Link from 'next/link';
import { Button } from '../../../components/molecules/Buttons/Button';
import InputText from '../../../components/molecules/Input/InputText';
import Table from '../../../components/organisms/Table';
import IconButton from '../../../components/molecules/Buttons/IconButton';
import { Device, UserRole } from '@prisma/client';
import { IconPencil } from '../../../assets/icons';

interface ServerSideProps {
  // Define any required props here
}

interface TransformedDeviceType extends Device {
  owner: {
    id: string;
  }
}

const filterNames = [
  { key: 'query', isArray: false },
  // Add more filters as needed
];

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  try {
    // Fetch any required data for the page
    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

const LanchasPage: NextPage<ServerSideProps> = ({ }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filters, setFilters } = useFilters(filterNames);
  const user = useAuthenticatedUser();

  const isOwner = (deviceSelected: TransformedDeviceType) => {
    return deviceSelected.owner.id === user?.id;
  }
  const isUserAdmin = user?.role === UserRole.ADMIN;

  const debouncedFilters = useDebounce(filters, 700);

  const query = useQueryUpdater<GetDevicesResponse>(
    `/api/lanchas/`,
    debouncedFilters
  );

  if (query.error) {
    return <h1>Ups... Error!</h1>;
  }


  let devices: GetDevicesResponseForTable = [];
  if (query.data) {
    devices = query.data.map((device) => ({
      ...device,
      organizationName: device.owner.organizationName,
    }));
  }

  return (
    <div className="bg-box-background h-screen">
      <AdminLayout title="Lanchas">
        <div className="flex flex-col space-y-5">
          <div className='flex justify-between'>
            <Text as="h3">Lanchas</Text>
            <Link href={`lanchas/new`}>
              <Button variant="primary-admin" iconSize='xxs' icon={<PlusIcon />}>
                Nueva lancha
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
        </div>

        {query.isValidating && <Text as="h3">Cargando...</Text>}

        {!query.isValidating && query.data && (
          <Table
            className='table-admin'
            data={[...devices]}
            cells={['name', 'id', 'organizationName', 'description']}
            headers={[
              {
                label: 'Nombre',
                key: 'name',
              },
              {
                label: 'ID',
                key: 'id',
              },
              {
                label: 'Organización',
                key: 'organizationName',
              },
              {
                label: 'Descripción',
                key: 'description',
              },
              {
                label: 'Ver/Editar',
                isAction: true,
                key: 'edit',
              },
            ]}
            actions={[
              ({ data }) => (
                <Link href={`lanchas/${(data as Device).id}`}>
                  <IconButton
                    icon={isOwner(data as TransformedDeviceType) || isUserAdmin ? <IconPencil /> : <EyeIcon />}
                    iconSize="xxs"
                    variant="primary-admin"
                  />
                </Link>)
              ,
            ]}
            formatCell={[
              {
                condition: (key) => key === 'description',
                component: ({ value }) => (
                  <div className="text-ellipsis truncate w-[150px] overflow-hidden">
                    {value}
                  </div>
                ),
              },
            ]}
          />
        )}
      </AdminLayout>
    </div>
  );
};

export default LanchasPage;
