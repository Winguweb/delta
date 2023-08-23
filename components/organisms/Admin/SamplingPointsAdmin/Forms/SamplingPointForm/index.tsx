import React, { useEffect, useState } from 'react';
import { ZodError } from 'zod';
import { updateSamplingPointSchema } from '../../../../../../model/samplingPoint';
import Link from 'next/link';
import { AreaType, WaterBodyType } from '@prisma/client';
import { Button } from '../../../../../molecules/Buttons/Button';
import { RowTextInputs } from '../../components/RowTextInputs';
import Select from '../../../../../molecules/Input/Select';
import InputText from '../../../../../molecules/Input/InputText';
import { GetUserResponse } from '../../../../../../model/user';
import { useAuthenticatedUser } from '../../../../../../hooks/useAuthenticatedUser';
import countries from '../../../../../../utils/countries';


interface SamplingPointFormProps {
    onSubmit: (data: any) => Promise<void>;
    initialData: any;
    isEditMode: boolean;
    userData?: {
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        organizationName: string,
    };
}

export const SamplingPointForm: React.FC<SamplingPointFormProps> = ({ onSubmit, initialData, isEditMode, userData }) => {
    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState<Record<keyof typeof data, string | null>>({});

    useEffect(() => {
        // If it's in edit mode, set the initialData when props change
        if (isEditMode) {
            setData(initialData);
        }
    }, [isEditMode, initialData]);

    const handleChange = (
        eventOrValue: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | string[],
        name?: string
    ) => {
        // manage data from Select component
        if (name && typeof eventOrValue === 'string') {
            setData((prev: any) => ({ ...prev, [name]: eventOrValue as string }));
            return;
        }

        // manage data from InputText component
        const event = eventOrValue as React.ChangeEvent<HTMLInputElement>;
        if (event.target.name === 'latitude' || event.target.name === 'longitude') {
            setData((prev: any) => ({
                ...prev,
                [event.target.name]: parseFloat(event.target.value),
            }));
            return;
        }
        setData((prev: any) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const validateData = (): typeof errors => {
        try {
            updateSamplingPointSchema.parse(data);
            return {};
        } catch (e) {
            if (e instanceof ZodError) {
                const err = e;
                const newErrors = Object.keys(data).reduce((acc, key) => {
                    const newError = err.issues.find((issue) => issue.path[0] === key);
                    return {
                        ...acc,
                        [key]: newError?.message ?? null,
                    };
                }, {} as typeof errors);
                return newErrors;
            } else {
                console.error(e);
                return {};
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateData();
        setErrors(validationErrors);

        if (Object.values(validationErrors).some((error) => error !== null)) {
            return;
        }

        try {
            await onSubmit(data);
        } catch (error) {
            console.error(error);
        }
    };

    const user = useAuthenticatedUser();
    const owner = userData ? `${userData.firstName} ${userData.lastName}` : `${user?.firstName} ${user?.lastName}`;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="flex w-full flex-col lg:flex-row lg:space-x-4 space-x-0 lg:space-y-0 space-y-2">
                <RowTextInputs
                    className="w-full"
                    inputs={[
                        {
                            label: 'Nombre',
                            onChange: handleChange,
                            value: data.name,
                            name: 'name',
                            error: errors.name,
                        },
                    ]}
                />
                <div className='w-full lg:w-3/6'>
                    <Select
                        label='Tipo'
                        value={data.areaType}
                        onChange={(value) => handleChange(value, 'areaType')}
                        placeholder={'Tipo de area'}
                        variant={'admin'}
                    >
                        {Object.values(AreaType).map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.areaType && (
                        <p className="mt-2 text-sm text-red-600" id="areaType-error">
                            {errors.areaType}
                        </p>
                    )}
                </div>

            </div>


            <div className="flex flex-col lg:flex-row lg:space-x-4 space-x-0 lg:space-y-0 space-y-2">
                <RowTextInputs
                    className='w-full lg:w-2/3'
                    inputs={[
                        {
                            onChange: handleChange,
                            value: data.latitude,
                            label: 'Latitud',
                            name: 'latitude',
                            numberInput: true,
                            error: errors.latitude,
                        },
                        {
                            onChange: handleChange,
                            value: data.longitude,
                            label: 'Longitud',
                            name: 'longitude',
                            numberInput: true,
                            error: errors.longitude,
                        },
                    ]}
                />
                <div className='w-full lg:w-1/3'
                >

                    <Select
                        label='País'
                        value={data.country}
                        onChange={(value) => handleChange(value, 'country')}
                        placeholder={'País'}
                        variant={'admin'}
                    >
                        {countries.map((country) => (
                            <Select.Option key={country.code} value={country.name}>
                                {country.name}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.waterBodyType && (
                        <p className="mt-2 text-sm text-red-600" id="waterBodyType-error">
                            {errors.waterBodyType}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4 space-x-0 lg:space-y-0 space-y-2 w-full">
                <div className="flex space-x-4 w-full lg:w-1/3">
                    <Select
                        label='Cuerpo de agua'
                        value={data.waterBodyType}
                        onChange={(value) => handleChange(value, 'waterBodyType')}
                        placeholder={'Cuerpo de agua'}
                        variant={'admin'}
                    >
                        {Object.values(WaterBodyType).map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                    {errors.waterBodyType && (
                        <p className="mt-2 text-sm text-red-600" id="waterBodyType-error">
                            {errors.waterBodyType}
                        </p>
                    )}
                </div>

                <RowTextInputs
                    inputs={[
                        {
                            label: 'Nombre del cuerpo de agua',
                            onChange: handleChange,
                            value: data.waterBodyName,
                            name: 'waterBodyName',
                            error: errors.waterBodyName,
                        },
                    ]}
                />


            </div>
            <RowTextInputs
                inputs={[
                    {
                        label: 'Descripción',
                        onChange: handleChange,
                        value: data.description,
                        name: 'description',
                        error: errors.description,
                    },
                ]}
            />

            <InputText
                variant={'admin'}
                disabled={true}
                defaultValue={owner}
                placeholder="Nombre y apellido"
                label="Responsable"
            />

            <div className="flex space-x-4">
                <Link href={`/admin/sampling-points`}>
                    <Button variant="secondary">Cancelar</Button>
                </Link>
                <Button type="submit">{isEditMode ? 'Guardar' : 'Crear'}</Button>
            </div>
            <div className="flex space-x-4">
            </div>
        </form>
    );
};

