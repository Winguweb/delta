import {
  ArrowDownOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { UserRole } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { z } from 'zod';
import { GetUserResponse } from '../../../model/user';
import axiosFromServerSideProps from '../../../utils/axiosFromServerSideProps';
import checkErrors from '../../../utils/checkErrors';
import roleDict from '../../../utils/rolesDictionary';
import { GetCountriesResponse } from '../../../model/country';
import { Button } from '../../../components/molecules/Buttons/Button';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import InputText from '../../../components/molecules/Input/InputText';
import Select from '../../../components/molecules/Input/Select';

interface ServerSideProps {
  user: GetUserResponse;
  countries: GetCountriesResponse;
}

type Data = z.infer<typeof dataSchema>;

/**
 * Esta es la pantalla para editar un usuario que poseen los Admins.
 */


export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (ctx) => {
  try {
    const user: GetUserResponse = await (await axiosFromServerSideProps(ctx))
      .get(`/api/admin/users/${ctx.query.id}`)
      .then((res) => res.data);

    if (['BLOCKED', 'PENDING'].includes(user.status)) {
      throw new Error('User not found');
    }

    const countries: GetCountriesResponse = await (await axiosFromServerSideProps(ctx))
      .get(`/api/countries`)
      .then((res) => res.data);

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        countries: JSON.parse(JSON.stringify(countries)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

const dataSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().min(1, 'El email es requerido'),
  telephone: z.string().min(1, 'El teléfono es requerido'),
  organizationName: z.string().min(1, 'El nombre de la organización es requerido'),
  organizationRole: z.string(),
  organizationCountryId: z.string().uuid('El país de la organización es requerido'),
  role: z.nativeEnum(UserRole),
});

const initialErrors: Record<keyof Data, string | null | undefined> = {
  firstName: null,
  lastName: null,
  email: null,
  telephone: null,
  role: null,
  organizationName: null,
  organizationRole: null,
  organizationCountryId: null,
};

const UserForm: NextPage<ServerSideProps> = ({ user, countries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [data, setData] = useState<Data>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    telephone: user.telephone,
    role: user.role,
    organizationName: user.organizationName,
    organizationRole: user.organizationRole,
    organizationCountryId: user.organizationCountry.id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const [errors, setErrors] = useState(initialErrors);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const newErrors = checkErrors(dataSchema, data, initialErrors);

    setErrors(newErrors);

    if (
      Object.values(newErrors).some(
        (error) => error !== null && error !== undefined
      )
    ) {
      return;
    }

    try {
      await axios.put(`/api/admin/users/${user.id}`, data);
      window.alert('Usuario actualizado');
    } catch (e) {
      console.error(e);
      window.alert('Error al actualizar el usuario');
    }
  };

  const handleToggleActivate = async () => {
    try {
      await axios.post(
        `/api/admin/users/${user.id}/${user.status === 'ACTIVE' ? 'inactivate' : 'aprobar'
        }`
      );
      window.alert('Usuario actualizado');
      window.location.reload();
    } catch (e) {
      console.error(e);
      window.alert('Error al actualizar el usuario');
    }
  };

  return (
    <AdminLayout
      backButton={{
        redirectTo: '/admin/users',
      }}
      title="Editar usuario"
    >
      <div className="flex flex-col space-y-6">
        <div className="w-full flex justify-end">
          <Button
            icon={<XMarkIcon />}
            iconSize="small"
            variant="tertiary"
            className={user.status !== 'ACTIVE' ? undefined : 'text-danger'}
            iconClassName={user.status !== 'ACTIVE' ? undefined : 'bg-danger'}
            onClick={handleToggleActivate}
          >
            {user.status === 'ACTIVE' ? 'Inactivar' : 'Activar'} usuario
          </Button>
        </div>
        <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-5 space-y-3 lg:space-y-0">
            <InputText
              value={data.firstName}
              name="firstName"
              onChange={handleChange}
              label="Nombre"
              error={errors.firstName}
            />
            <InputText
              value={data.lastName}
              name="lastName"
              onChange={handleChange}
              label="Apellido"
              error={errors.lastName}
            />
          </div>

          <div className="flex space-x-5">
            <InputText
              value={data.email}
              name="email"
              onChange={handleChange}
              label="Email"
              error={errors.email}
            />
            <InputText
              value={data.telephone}
              name="telephone"
              onChange={handleChange}
              label="Teléfono"
              error={errors.telephone}
            />
          </div>

          <div className="flex space-x-5">
            <InputText
              value={data.organizationName}
              name="organizationName"
              onChange={handleChange}
              label="Organización"
              error={errors.organizationName}
            />
            <InputText
              value={data.organizationRole}
              name="organizationRole"
              onChange={handleChange}
              label="Rol en la organización"
              error={errors.organizationRole}
            />
          </div>

          <div className="flex space-x-5">
            <Select
              value={data.organizationCountryId}
              onChange={(value) => {
                setData({ ...data, organizationCountryId: value as string });
              }}
              label="País"
              error={errors.organizationCountryId ?? undefined}
            >
              {Object.values(countries).map((country) => (
                <Select.Option key={country.id} value={country.id}>
                  {country.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              value={data.role}
              onChange={(value) => {
                setData({ ...data, role: value as UserRole });
              }}
              label="Rol"
              error={errors.role ?? undefined}
            >
              {Object.values(UserRole).map((role) => (
                <Select.Option key={role} value={role}>
                  {roleDict[role]}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="w-full flex justify-center lg:justify-start py-3 space-x-4">
            <Link href="/admin/users">
              <Button icon={<XMarkIcon />} iconSize="small" variant="secondary">Cancelar</Button>
            </Link>
            <Button type="submit" icon={<ArrowDownOnSquareIcon />} iconSize="small">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UserForm;
