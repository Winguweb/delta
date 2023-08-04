import { yupResolver } from '@hookform/resolvers/yup';
import {  GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputText from '../../components/molecules/Input/InputText';
import Text from '../../components/molecules/Text';
import { Icon } from '../../components/molecules/Icon';
import MainContainer from '../../components/organisms/MainContainer';
import { Button } from '../../components/molecules/Buttons/Button';
import { Modal } from '../../components/organisms/Modal';
import axios from 'axios';
import { Country } from '@prisma/client';
import { GetCountriesResponse } from '../../model/country';
import axiosFromServerSideProps from '../../utils/axiosFromServerSideProps';
import Select from '../../components/molecules/Input/Select';


type ServerSideProps = {
  countries: GetCountriesResponse;
};

export type FormValuesStepOne = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  organizationName: string;
  organizationRole: string;
  organizationCountryId: string;
};

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  telephone: '',
  organizationName: '',
  organizationRole: '',
  organizationCountryId: '',
};

const schema = yup
  .object({
    email: yup
      .string()
      .email('El correo debe tener este formato ejemplo@correo.com')
      .required('Por favor ingrese su correo'),
    firstName: yup.string().required('Por favor ingrese su nombre'),
    lastName: yup.string().required('Por favor ingrese su apellido'),
    telephone: yup.string().required('Por favor ingrese su número de teléfono'),
    organizationName: yup.string().required('Por favor ingrese el nombre de la organización'),
    organizationRole: yup.string().required('Por favor ingrese el rol en la organización'),
    organizationCountryId: yup.string().required('Por favor ingrese país de la organización'),
  })
  .required();


export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  try {
    const countries: GetCountriesResponse = await (
      await axiosFromServerSideProps(ctx)
    )
      .get(`/api/countries`)
      .then((res) => JSON.parse(JSON.stringify(res.data)));

    return {
      props: {
        countries
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

const StepOne: NextPage<ServerSideProps> = ({ countries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
  } = useForm<FormValuesStepOne>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleStepOne = async (data: FormValuesStepOne) => {
    const query = queryString.stringify(data);
    router.push({
      pathname: '/registro/step-two',
      search: `?${query}`,
    });
  };

  return (
    <>
      <Head>
        <title>Delta  - Solicitar cuenta</title>
      </Head>

      <MainContainer
        className={
          'w-full flex flex-col justify-center px-0 lg:px-4 py-10'
        }
        bg={'bg-main-image'}
      >
        <div className="w-full lg:w-3/5 m-o lg: mx-auto flex flex-col justify-center space-y-8 rounded-2xl shadow-main bg-white px-8 py-4">
          <form className={'p-5'} onSubmit={handleSubmit(handleStepOne)}>
            <Text as="h2" className="text-center">
              Solicitar cuenta
            </Text>
            <p className="text-sm text-center"></p>
            <div className="flex flex-wrap -mx-3 my-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      rounded="md"
                      label="Nombre"
                      placeholder="Nombre"
                      name="name"
                      type="text"
                      error={errors.firstName?.message}
                      required={true}
                    />
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      rounded="md"
                      label="Apellido"
                      placeholder="Apellido"
                      name="lastName"
                      type="text"
                      error={errors.lastName?.message}
                      required={true}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 my-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      rounded="md"
                      label="Correo electrónico"
                      placeholder="Correo electrónico"
                      name="email"
                      type="text"
                      error={errors.email?.message}
                      required={true}
                      marginLeft={'7.7'}
                    />
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <Controller
                  name="telephone"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      rounded="md"
                      label="Teléfono"
                      placeholder="Teléfono"
                      name="telephone"
                      type="text"
                      error={errors.telephone?.message}
                      required={true}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 my-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <Controller
                  name="organizationName"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      rounded="md"
                      label="Nombre de la organización"
                      placeholder="Nombre de la organización"
                      name="organizationName"
                      type="text"
                      error={errors.organizationName?.message}
                      required={true}
                      marginLeft={'10.7'}
                    />
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <Controller
                  name="organizationRole"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      {...field}
                      rounded="md"
                      label="Rol en la organización"
                      placeholder="Rol en la organización"
                      name="organizationRole"
                      type="text"
                      error={errors.organizationRole?.message}
                      required={true}
                      marginLeft={'9'}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 my-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <Controller
                  name="organizationCountryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value ? field.value : null}
                      onChange={(selectedValue) => field.onChange(selectedValue as string)}
                      placeholder="Seleccione un país"
                      label="País de la organización"
                      className='!max-h-32'
                      required={true}
                      marginLeft={'9.3'}
                    >
                      {countries.map((country) => (
                        <Select.Option key={country.id} value={country.id}>
                          {country.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />

              </div>
            </div>
            <div className="m-3">
              {!response && error != '' && (
                <p className="color-primary">
                  Algo salió mal, vuelve a intentar.(Error: {error})
                </p>
              )}
            </div>
            <div className="flex justify-center my-10">
              <Button
                variant="primary"
                type="submit"
                size="md"
                className="w-52"
              >
                Continuar
              </Button>
            </div>
            {showModal ? (
              <Modal
                logo={true}
                showModal={showModal}
                width={'w-2/4'}
                className={'bg-primary flex flex-col pt-12'}
              >
                <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem] ">
                  <h2 className="text-xl font-semibold p-2">¡Gracias...!</h2>
                  <p className="text-center p-5">
                    Revisaremos los datos enviados y nos pondremos en contacto a
                    la brevedad.
                  </p>
                  <div className="pb-4 lg:pt-3 flex justify-center ">
                    <button
                      className="btn-primary font-bold"
                      type="button"
                      onClick={() => {
                        router.push('/');
                      }}
                    >
                      Volver al inicio
                    </button>
                  </div>
                </div>
              </Modal>
            ) : null}
          </form>
        </div>
      </MainContainer>
    </>
  );
};

export default StepOne;
