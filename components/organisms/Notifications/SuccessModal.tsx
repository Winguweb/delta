import React from 'react';
import { Modal } from '../Modal';
import { useRouter } from 'next/router';

export type SuccessModalProps = {
  showModal: boolean,
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ showModal }) => {
  const router = useRouter();

  return <Modal
    showModal={showModal}
    className={'flex flex-col pt-12'}
    width={'lg:w-1/2 md:w-3/4 w-full'}
  >
    <div className="flex items-center justify-center flex-col px-2 space-y-4 mt-4">
      <h2 className="text-xl font-semibold p-2">¡Gracias!</h2>
      <p className="text-center">
        Has completado correctamente la solicitud, ahora recibirás notificaciones por WhatsApp cuando el
        servicio esté cerca de tu muelle.
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
  </Modal>;
};