import {PlusIcon,} from '@heroicons/react/24/outline';
import Head from 'next/head';
import Text from "../../components/molecules/Text";
import Link from "next/link";
import {Button} from "../../components/molecules/Buttons/Button";
import Table from "../../components/organisms/Table";
import IconButton from "../../components/molecules/Buttons/IconButton";
import {IconPencil} from "../../assets/icons";
import useFilters from "../../hooks/useFilters";
import {useAuthenticatedUser} from "../../hooks/useAuthenticatedUser";
import useDebounce from "../../hooks/useDebounce";
import useQueryUpdater from "../../hooks/useQueryUpdater";
import {GetDevicesResponse, GetDevicesResponseForTable} from "../../model/device";

const filterNames = [
    {key: 'query', isArray: false},
    // Add more filters as needed
];

// @ts-ignore
const BotonAgregarLancha = ({disabled}) => {
    if(disabled) {
        return (
            <Button variant="primary-admin" iconSize='xxs' icon={<PlusIcon/>} disabled>
                Agregar Lancha
            </Button>
        )
    }

    return (
        <Link href={`/provider/new`}>
            <Button variant="primary-admin" iconSize='xxs' icon={<PlusIcon/>}>
                Agregar Lancha
            </Button>
        </Link>
    )
}

export default function Lanchas() {
    const {filters,} = useFilters(filterNames);
    const user = useAuthenticatedUser();

    const debouncedFilters = useDebounce(filters, 700);

    const query = useQueryUpdater<GetDevicesResponse>(`/api/devices/`, debouncedFilters);

    if (query.error) {
        return <main className='px-6 my-2 lg:mx-auto lg:w-desktop'>
            <h1>Ups... Error!</h1>
        </main>
    }

    let devices: GetDevicesResponseForTable = [];
    if (query.data) {
        devices = query.data.filter((device) => device.owner.id === user?.id)
            .map((device) => ({
                ...device,
                organizationName: device.owner.organizationName,
            }));
    }

    return (
        <>
            <Head>
                <title>Lanchas</title>
            </Head>
            <main className='px-6 my-2 lg:mx-auto lg:w-desktop'>
                <div className='flex justify-between'>
                    <Text as="h3">Lanchas</Text>
                    <BotonAgregarLancha disabled={devices.length > 0}/>
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
                            ({data}) => (
                                // <Link href={`modulos/${(data as Device).id}`} aria-disabled>
                                <IconButton
                                    icon={<IconPencil/>}
                                    iconSize="xxs"
                                    variant="primary-admin"
                                    disabled
                                />
                                // </Link>
                            ),
                        ]}
                        formatCell={[
                            {
                                condition: (key) => key === 'description',
                                component: ({value}) => (
                                    <div className="text-ellipsis truncate w-[150px] overflow-hidden">
                                        {value}
                                    </div>
                                ),
                            },
                        ]}
                    />
                )}
            </main>
        </>
    );
}
