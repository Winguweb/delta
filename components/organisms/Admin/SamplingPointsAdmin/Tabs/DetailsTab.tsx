import Link from "next/link";
import { SamplingPointContainer, SamplingPointData } from "../components/SamplingPointContainer";
import { Button } from "../../../../molecules/Buttons/Button";
import { GetSamplingPointResponseWithSamples } from "../../../../../pages/admin/sampling-points/[id]";
import { SamplingPointDetailsTable } from "../Tables/SamplingPointDetailsTable";
import { useState } from "react";
import { ZodError } from "zod";
import { updateSamplingPointSchema } from "../../../../../model/samplingPoint";
import { PencilIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SamplingPointForm } from "../Forms/SamplingPointForm";
import { GetSampleResponse } from "../../../../../model/sample";
import axios from "axios";
import { Modal } from "../../../Modal";
import { SampleForm } from "../Forms/SampleForm";
import { useRouter } from "next/router";
import { GetUserResponse } from "../../../../../model/user";
import { IconPencil } from "../../../../../assets/icons";
import { useAuthenticatedUser } from "../../../../../hooks/useAuthenticatedUser";
import { User, UserRole } from "@prisma/client";

type DetailsTabProps = {
    isAbleToPerformActions: boolean;
    samplingPoint: GetSamplingPointResponseWithSamples;
    owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'organizationName' | 'email'> 
}


const initialErrors = {
    name: null,
    areaType: null,
    latitude: null,
    longitude: null,
    country: null,
    waterBodyType: null,
    waterBodyName: null,
    description: null,
};


export const DetailsTab = ({ isAbleToPerformActions, samplingPoint, owner }: DetailsTabProps) => {

    const [isEdit, setIsEdit] = useState(false)

    const userData = owner;

    const router = useRouter()

    const detailsFirstColumn = [
        {
            title: 'Nombre',
            data: `${samplingPoint.name}`,
        },
        {
            title: 'Tipo',
            data: samplingPoint.areaType,
        },
        {
            title: 'Latitud',
            data: `${samplingPoint.latitude}`,
        },
        {
            title: 'Longitud',
            data: `${samplingPoint.longitude}`,
        },
        {
            title: 'País',
            data: `${samplingPoint.country}`,
        },
        {
            title: 'Cuerpo de agua',
            data: samplingPoint.waterBodyType,
        },
        {
            title: 'Nombre del cuerpo de agua',
            data: `${samplingPoint.waterBodyName}`,
        },
        {
            title: 'Descripción',
            data: `${samplingPoint.description}`,
        },
        {
            title: 'Propietario / Owner',
            data: `${userData.firstName} ${userData.lastName}`,
        },


    ];

    const [data, setData] = useState({
        name: samplingPoint.name ?? '',
        areaType: samplingPoint.areaType ?? '',
        latitude: samplingPoint.latitude ?? '',
        longitude: samplingPoint.longitude ?? '',
        country: samplingPoint.country ?? '',
        waterBodyType: samplingPoint.waterBodyType ?? '',
        waterBodyName: samplingPoint.waterBodyName ?? '',
        description: samplingPoint.description ?? '',
    });

    const [errors, setErrors] =
        useState<Record<keyof typeof data, string | null>>(initialErrors);

    const handleChange = (
        eventOrValue:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | string,
        name?: string
    ) => {
        // manage data from Select component
        if (name && typeof eventOrValue === 'string') {
            setData((prev) => ({ ...prev, [name]: eventOrValue as string }));
            return;
        }

        // manage data from InputText component
        const event = eventOrValue as React.ChangeEvent<HTMLInputElement>;
        if (event.target.name === 'latitude' || event.target.name === 'longitude') {
            setData((prev) => ({
                ...prev,
                [event.target.name]: parseFloat(event.target.value),
            }));
            return;
        }
        setData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const checkErrors = (): typeof initialErrors => {
        try {
            //validar los datos
            updateSamplingPointSchema.parse(data);
            return initialErrors;
        } catch (e) {
            if (e instanceof ZodError) {
                const err = e;
                // Procesa los errores capturados con ZodError
                const newErrors = Object.keys(initialErrors).reduce((acc, key) => {
                    const newError = err.issues.find((issue) => issue.path[0] === key);
                    return {
                        ...acc,
                        [key]: newError?.message ?? null,
                    };
                }, {} as typeof initialErrors);
                return newErrors;
            } else {
                console.error(e);
                return initialErrors;
            }
        }
    };

    const handleSubmitForm = async (formData: any) => {
        const errors = checkErrors();
        setErrors(errors);

        try {
            await axios.put(`/api/sampling-points/${samplingPoint.id}`, formData);
            router.push(`/admin/sampling-points/${samplingPoint.id}`);
            window.alert('Datos actualizados correctamente');
        } catch (error) {
            window.alert('Hubo un error, vuelve a intentarlo.');
        }
    };


    const initialData = {
        name: samplingPoint.name ?? '',
        areaType: samplingPoint.areaType ?? 0,
        latitude: samplingPoint.latitude ?? '',
        longitude: samplingPoint.longitude ?? '',
        country: samplingPoint.country ?? '',
        waterBodyType: samplingPoint.waterBodyType ?? 0,
        waterBodyName: samplingPoint.waterBodyName ?? '',
        description: samplingPoint.description ?? '',
    }



    return (
        isEdit ?
            (<SamplingPointContainer
                rightElement={
                    <Button
                        variant="secondary"
                        iconSize="xxs"
                        spanClassName={'hidden'}
                        icon={<XMarkIcon />}
                        onClick={() => setIsEdit(false)}
                    >
                        Cancelar
                    </Button>

                }
            >
                <div className="flex flex-col space-y-8">
                    <SamplingPointForm onSubmit={handleSubmitForm} initialData={initialData} isEditMode={true} userData={userData} />
                </div>
            </SamplingPointContainer >)
            :
            (<SamplingPointContainer
                rightElement={ isAbleToPerformActions ?
                    <Button
                        variant="primary-admin"
                        spanClassName={'hidden'}
                        icon={<IconPencil />}
                        onClick={() => setIsEdit(true)}

                    >
                        Editar
                    </Button> : ""
                }
            >
                <div className={`flex flex-col space-y-3 lg:space-x-0 lg:grid lg:grid-cols-2 lg:gap-6`}>
                    {detailsFirstColumn.map((detail) => (
                        <SamplingPointData key={detail.title} {...detail} />
                    ))}
                </div>
            </SamplingPointContainer>)
    )
}


