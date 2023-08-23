import React, { useEffect, useState } from 'react'
import Text from '../../../molecules/Text';
import { Button } from '../../../molecules/Buttons/Button';
import { ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import IconButton from '../../../molecules/Buttons/IconButton';
import axios from 'axios';
import { PostDeviceApiKeyResponse } from '../../../../model/device';
import { Modal } from '../../Modal';
import Alert from '../../../molecules/Alert';

interface DeviceApiKeyModalProps {
  deviceId: number,
  showModal: boolean,
  setShowModal: (x: boolean) => void,
}

export const DeviceApiKeyModal = ({ deviceId, showModal, setShowModal }: DeviceApiKeyModalProps) => {
  const [deviceApiKey, setDeviceApiKey] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const postDeviceApiKey = async () => {
      try {
        const response: PostDeviceApiKeyResponse = await axios.post(`/api/devices/${deviceId}/generate-api-key`).then(res => res.data);
        setDeviceApiKey(response.apiKey ? response.apiKey as string : '');
      } catch (error) {
        setError(true)
      }
    };
    postDeviceApiKey();
  }, []);


  const handleCopyDeviceApiKey = () => {
    navigator.clipboard.writeText(deviceApiKey);
    setCopied(true);
  };

  return (
    <Modal
      showModal={showModal}
      width={'w-4/5 lg:w-1/3'}
      className={'flex flex-col pt-2 z-50'}
    >
      <div className="absolute top-2 right-2">
        <IconButton
          onClick={() => setShowModal(false)}
          icon={<XMarkIcon />}
          iconSize="small"
          iconColor='primary'
        />
      </div>
      <div className="space-y-4 flex-col mt-4 mb-4 px-10 py-4">
        <Text as="h2" className="font-semibold !text-xl w-full ">
          Clave generada
        </Text>
        {deviceApiKey && (
          <div className="w-full flex items-center">
            <Text as="p2" className='text-base'>
              {deviceApiKey}
            </Text>
            <Button
              variant='primary-admin'
              iconSize='xxs'
              onClick={handleCopyDeviceApiKey}
              icon={<ClipboardIcon />}
              size='md'
              className="w-2/5 !rounded-full mx-4"
            >
            </Button>
          </div>
        )}
        {copied && (
          <Text as="p2" className="text-center text-success mt-2 shadow-xl">
            Clave copiada
          </Text>
        )}
        {deviceApiKey && (
          <Alert message='Copie la clave antes de cerrar esta ventana o deberá generar una nueva.'></Alert>
        )}
        {error && (
          <Text as="p2" className="text-center text-danger mt-2 shadow-xl">
            Hubo un error al generar la clave
          </Text>
        )}
      </div>
    </Modal >
  )
}
