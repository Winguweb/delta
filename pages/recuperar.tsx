import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { CheckIcon } from '@heroicons/react/24/outline';
import MainContainer from '../components/organisms/MainContainer';
import Text from '../components/molecules/Text';
import InputText from '../components/molecules/Input/InputText';
import { Modal } from '../components/organisms/Modal';
import { Button } from '../components/molecules/Buttons/Button';
import Loading from '../components/atoms/Loading';
import { Icon } from '../components/molecules/Icon';

const ResetPasswordEmailPage: NextPage = (props) => {
  const [email, setEmail] = React.useState('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true)
    if (!email) return;

    try {
      await axios.post('/api/auth/reset-password-email', { email });
      setShowModal(true);
    } catch (error: any) {
      setError(error.response.data.message);
    }
    setIsLoading(false)

  };

  return (
    <>
      <Head>
        <title>Delta - Recuperar contraseña</title>
      </Head>
      <MainContainer
        className={'w-full h-fit flex justify-center px-4 py-28'}
        bg={'bg-main-image'}
      >
        <div className="w-full flex justify-center">
          <form className={'w-full lg:w-2/4 rounded-2xl'} onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl p-5 lg:p-12">
              <Text as={'h2'} className="text-center">
                Recuperar contraseña
              </Text>
              <div className="my-6">
                <InputText
                  label="Ingresa tu correo electrónico"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
               <div className="m-3">
                {error != '' && (
                  <Text as="p3" className="text-error">
                    Ha ocurrido un error. Por favor, intenta de nuevo.(Error: {error})
                  </Text>
                )}
              </div>
              <div className="flex justify-center ">
                <Button className="w-60" variant="primary" type="submit">
                  {isLoading ? <Loading color='white' size={20} /> : 'Enviar correo'}
                </Button>
              </div>
            </div>
            {showModal ? (
              <Modal
                logo={true}
                showModal={showModal}
                width={'w-4/5 lg:w-2/4'}
                className={'bg-primary flex flex-col pt-12'}
              >
                <div className="flex items-center justify-center flex-col px-2 space-y-4 mt-4">
                  <Icon size="small" icon={<CheckIcon />}/>
                  <p className="text-center p-0 lg:p-2">
                    Se ha enviado un correo a tu cuenta de correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
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

export default ResetPasswordEmailPage;
