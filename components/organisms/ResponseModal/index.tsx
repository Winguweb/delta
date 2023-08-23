import React from 'react'
import { Modal } from '../Modal';
import Text from '../../molecules/Text';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ResponseModalProps {
    message: string,
    showModal: boolean,
    routePathname: string,
}

export const ResponseModal = ({message, showModal, routePathname}:ResponseModalProps) => {
    const router = useRouter();
  return (
    <Modal
    showModal={showModal}
    width={'w-4/5 lg:w-1/4'}
    className={'flex flex-col pt-12'}
  >
    <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem]">
      <Text as="p1" className="text-center font-semibold pb-4 pt-4">
        {message}
      </Text>
      <div className="pb-4 lg:pt-3 flex justify-center">
      <Link href={`${routePathname}`}>
        <button
          className="btn-primary font-bold"
          type="button"
        >
          OK
        </button>
      </Link>
      </div>
    </div>
  </Modal>
  )
}
