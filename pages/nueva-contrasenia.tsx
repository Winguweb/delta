import { CheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import MainContainer from '../components/organisms/MainContainer';
import { Icon } from '../components/molecules/Icon';
import { Button } from '../components/molecules/Buttons/Button';
import Text from '../components/molecules/Text';
import { Modal } from '../components/organisms/Modal';
import InputText from '../components/molecules/Input/InputText';

type FormValues = {
  password: string;
  passwordConfirm: string;
};

const defaultValues = {
  password: '',
  passwordConfirm: '',
};

type PasswordVisibility = {
  password: boolean;
  passwordConfirm: boolean;
};

const schema = yup
  .object({
    password: yup
      .string()
      .min(8, 'La contraseña debe tener un mínimo de 8 caracteres')
      .matches(
        /[a-z]+/,
        'La contraseña debe tener al menos una minúscula, una mayúscula y un número'
      )
      .matches(
        /[A-Z]+/,
        'La contraseña debe tener al menos una minúscula, una mayúscula y un número'
      )
      .matches(
        /\d+/,
        'La contraseña debe tener al menos una minúscula, una mayúscula y un número'
      )
      .required('Por favor escriba su contraseña'),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Las contraseñas deben coincidir')
      .required('Por favor confirme su contraseña'),
  })
  .required();

const NewPasswordPage: NextPage = (props) => {
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const { token, email } = router.query;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!token || !email) {
      router.push('/');
    }
  }, [token, email, router]);

  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      password: false,
      passwordConfirm: false,
    });


  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleNewPassword = async (data: FormValues) => {

    const password = data.password;

    if (!password) return;


    await axios.post('/api/auth/reset-password', { password, email, token }).then((resp) => {
      setResponse(true);
      setError(resp.statusText);
    });
  };

  useEffect(() => {
    if (response) {
      setShowModal(true);
      // console.log('Enviado con exito');
    }
  }, [setResponse, response]);

  const handlePasswordVisibility = (id: keyof PasswordVisibility) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      <Head>
        <title>Delta  - Recuperar contraseña</title>
      </Head>

      <MainContainer
        className={
          'w-full flex flex-col justify-center px-0 lg:px-4 py-28 space-y-8'
        }
        bg={'bg-primary'}
      >
        <div className="w-full lg:w-3/5 m-0 lg:mx-auto flex flex-col justify-center space-y-8">
          <Image
            src="/assets/Logo.svg"
            alt="Delta Logo White"
            height={58}
            width={200}
          />
        </div>
        <div className="w-full lg:w-3/5 m-o lg: mx-auto flex flex-col justify-center space-y-8 bg-white rounded-2xl px-8 py-4">
          <form className={'p-5'} onSubmit={handleSubmit(handleNewPassword)}>
            <Text as="h2" className="text-center">
              Recuperar contraseña
            </Text>
            <p className="text-sm text-center"></p>
            <div className="flex flex-wrap -mx-3 my-6">
              <div className="relative w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputText
                        {...field}
                        rounded="md"
                        label="Contraseña"
                        placeholder="Contraseña"
                        name="password"
                        type={passwordVisibility.password ? 'text' : 'password'}
                        error={errors.password?.message}
                        required={true}
                        marginLeft={'5.3'}
                      />{' '}
                    </>
                  )}
                />
                <Icon
                  size={'xs'}
                  icon={
                    passwordVisibility.password ? <EyeIcon /> : <EyeSlashIcon />
                  }
                  className="absolute top-14 right-6 cursor-pointer"
                  onClick={() => handlePasswordVisibility('password')}
                />
              </div>
              <div className="relative w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <Controller
                  name="passwordConfirm"
                  control={control}
                  render={({ field }) => (
                    <>
                      {' '}
                      <InputText
                        {...field}
                        rounded="md"
                        label="Confirmar Contraseña"
                        placeholder="Confirmar Contraseña"
                        name="passwordConfirm"
                        type={
                          passwordVisibility.passwordConfirm
                            ? 'text'
                            : 'password'
                        }
                        error={errors.passwordConfirm?.message}
                        required={true}
                        marginLeft={'8.9'}
                      />{' '}
                    </>
                  )}
                />
                <Icon
                  size={'xs'}
                  icon={
                    passwordVisibility.passwordConfirm ? (
                      <EyeIcon />
                    ) : (
                      <EyeSlashIcon />
                    )
                  }
                  className="absolute top-14 right-6 cursor-pointer"
                  onClick={() => handlePasswordVisibility('passwordConfirm')}
                />
              </div>
            </div>
            <div className="m-3">
              {!response && error != '' && (
                <Text as="p3" className="text-error">
                  Algo salió mal, vuelve a intentar.(Error: {error})
                </Text>
              )}
            </div>
            <div className="flex justify-center my-10">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                // disabled={true}
                className="w-80"
              >
                Confirmar
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
                  <Icon size="small" icon={<CheckIcon />}/>
                  <p className="text-center p-5">
                    La contraseña se cambio con éxito
                  </p>
                  <div className="pb-4 lg:pt-3 flex justify-center ">
                    <button
                      className="btn-primary font-bold"
                      type="button"
                      onClick={() => {
                        router.push('/ingresar');
                      }}
                    >
                      Volver a ingresar
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

export default NewPasswordPage;
