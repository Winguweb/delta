import React from 'react'
import { Modal } from '../Modal';
import Text from '../../molecules/Text';
import { Button } from '../../molecules/Buttons/Button';

interface AlertDeleteModalProps {
  showModal: boolean,
  message: string,
  onCancel: () => void,
  onConfirm: () => Promise<void>,
}

export const AlertDeleteModal = ({ message, showModal, onCancel, onConfirm }: AlertDeleteModalProps) => {
  return (
    <Modal
      showModal={showModal}
      width={'w-4/5 lg:w-1/4'}
      className={'flex flex-col pt-12'}>
      <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem]">
        <Text as="h3" className='font-normal text-center'>{message}</Text>
        <div className='flex space-x-5 my-4'>
          <Button
            variant="secondary"
            onClick={onCancel}
            className="!rounded-full"
          >Cancelar</Button>
          <Button
            variant="secondary"
            onClick={onConfirm}
            className="!rounded-full !bg-primary !text-white"
          >Aceptar</Button>
        </div>
      </div>
    </Modal>
  )
}
