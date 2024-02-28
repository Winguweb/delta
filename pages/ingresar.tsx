import {
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Text from '../components/molecules/Text';
import MainContainer from '../components/organisms/MainContainer';
import { Icon } from '../components/molecules/Icon';

type FormValues = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email('El correo debe tener este formato ejemplo@correo.com')
      .required('Por favor escriba su correo'),
    password: yup.string().required('Por favor escriba su contraseña'),
  })
  .required();

const SignIn: NextPage = (props) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const handleSignIn = async (data: FormValues) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error && res?.status === 401) {
      setError('Los datos ingresados son incorrectos.');
    } else {
      await router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>Delta  - Ingresar</title>
      </Head>
      <MainContainer
        className={
          'w-full h-fit flex flex-col lg:flex-row justify-center lg:space-x-28 px-4 py-4 lg:py-16 !shadow-none'
        }
        bg={'bg-main-image'}
      >
        <div className="w-1/2 hidden lg:flex justify-center">
          <Image
            src="/assets/LogoText.png"
            alt="Delta Logo White"
            height={68}
            width={360}
          />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start pb-6 lg:pb-0">
          <form
            className={'w-full lg:w-2/3 rounded-2xl shadow-main'}
            onSubmit={handleSubmit(handleSignIn)}
          >
            <div className="bg-white rounded-2xl p-5 lg:p-12 space-y-4">
              <Text as="h2" className="text-center">
                Iniciar sesión
              </Text>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-thin text-gray-600 font-family-2"
                >
                  Usuario
                </label>

                <div>
                  <input
                    {...register('email')}
                    id="email"
                    name="email"
                    className="input-style placeholder-icon"
                    placeholder="e-mail"
                  />
                  <p className="text-danger text-sm">{errors.email?.message}</p>
                </div>
              </div>
              <div className="mb-8">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-thin text-gray-600 font-family-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={hidePassword ? 'password' : 'text'}
                    id="password"
                    name="password"
                    className="input-style placeholder-icon"
                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  />
                  <Icon
                    size={'xs'}
                    icon={hidePassword ? <EyeSlashIcon /> : <EyeIcon />}
                    className="absolute top-3.5 right-3.5 cursor-pointer"
                    onClick={() => setHidePassword(!hidePassword)}
                  />
                  <p className="text-danger text-sm">
                    {errors.password?.message}
                  </p>
                  {error && <p className="text-danger text-sm mt-4">{error}</p>}
                </div>
                <small
                  className={'flex justify-end pt-3 text-primary font-bold'}
                >
                  <button
                    type="button"
                    onClick={async () => {
                      await router.push('/recuperar');
                    }}
                  >
                    ¿Olvidaste la contraseña?
                  </button>
                </small>
              </div>
              <div className="mb-6">
                <button type="submit" className="btn-primary">
                  Ingresar
                </button>
              </div>
              <small className={'flex justify-center'}>
                ¿No tienes cuenta aún?{' '}
                <button
                  className="ml-2 text-primary font-bold"
                  type="button"
                  onClick={async () => {
                    await router.push('/registro/step-one');
                  }}
                >
                  Solicitar
                </button>
              </small>
            </div>
          </form>
        </div>
      </MainContainer>
    </>
  );
};

export default SignIn;
