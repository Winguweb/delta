import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormValuesStepOne } from './step-one';
import Text from '../../components/molecules/Text';
import MainContainer from '../../components/organisms/MainContainer';
import { Modal } from '../../components/organisms/Modal';
import { Button } from '../../components/molecules/Buttons/Button';
import { Icon } from '../../components/molecules/Icon';
import InputText from '../../components/molecules/Input/InputText';

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

const StepTwo: NextPage = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState<boolean>(false);
  const router = useRouter();
  const stepOneData = router.query as FormValuesStepOne;
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

  const handleStepTwo = async (data: FormValues) => {
    if (!registerConfirm) {
      setError('Debe aceptar los términos y condiciones');
      return;
    }
    const postData = { ...stepOneData, ...data };
    await fetch('/api/auth/signup', {
      body: JSON.stringify({
        email: postData.email,
        firstName: postData.firstName,
        lastName: postData.lastName,
        telephone: postData.telephone,
        password: postData.password,
        organizationName: postData.organizationName,
        organizationRole: postData.organizationRole,
        organizationCountryId: postData.organizationCountryId,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => {
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
        <title>Delta - Solicitar cuenta</title>
      </Head>

      <MainContainer
        className={
          'w-full flex flex-col justify-center px-0 lg:px-4 py-10 !shadow-none'
        }
        bg={'bg-main-image'}
      >
        <div className="w-full lg:w-3/5 m-o lg: mx-auto flex flex-col justify-center space-y-8 bg-white rounded-2xl shadow-main px-8 py-4">
          <form className={'p-5'} onSubmit={handleSubmit(handleStepTwo)}>
            <Text as="h2" className="text-center">
              Solicitar cuenta
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
                        marginLeft={'6'}
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
                        marginLeft={'10.5'}
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
            <div className="space-x-2">
              <input
                type="checkbox"
                id="confirm"
                onChange={(e) => setRegisterConfirm(e.target.checked)}
                checked={registerConfirm}
              />
              <label htmlFor="confirm" className="text-xs">
                Declaro que los datos proporcionados en este formulario son
                verdaderos y exactos en la medida de mi conocimiento. Acepto que
                la información proporcionada se utilizará para procesar mi
                solicitud de cuenta y me comprometo a notificar de inmediato
                cualquier cambio en mis datos personales o de contacto.
              </label>
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
                size="md"
                // disabled={true}
                className="w-52"
              >
                Enviar solicitud
              </Button>
            </div>
            {showModal ? (
              <Modal
                logo={true}
                showModal={showModal}
                width={'w-4/5 lg:w-2/4'}
                className={'bg-primary flex flex-col pt-12'}
              >
                <div className="flex items-center justify-center flex-col px-2 space-y-4 mt-4">
                  <h2 className="text-xl font-semibold p-2">¡Gracias!</h2>
                  <p className="text-center">
                    Has completado correctamente la solicitud, en breve
                    recibirás en tu casilla de mail las instrucciones para
                    acceder a tu usuario de Delta
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

export default StepTwo;
