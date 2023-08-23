import React, { useState } from 'react'
import { Modal } from '../../../../Modal';
import Text from '../../../../../molecules/Text';
import InputText from '../../../../../molecules/Input/InputText';
import { Button } from '../../../../../molecules/Buttons/Button';
import { ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import IconButton from '../../../../../molecules/Buttons/IconButton';
import axios from 'axios';
import { GetConfirmationToken } from '../../../../../../model/confirmationTokenAWS';

interface TokenModalProps {
    showModal: boolean,
    setShowModal: (x: boolean) => void,
}


export const TokenModal = ({ showModal, setShowModal }: TokenModalProps) => {
    const [arn, setArn] = useState('');
    const [token, setToken] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(false);

    const handleGetToken = async () => {
        setError(false)
        try {
            const response: GetConfirmationToken = await axios.get(`/api/external-samples/confirmation-token?arn=${arn}`).then(res => res.data)
            setToken(response.confirmationToken)
        } catch (error) {
            setError(true)
        }

    };

    const handleCopyToken = () => {
        navigator.clipboard.writeText(token);
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
            <div className="space-y-4 flex items-center flex-col my-4 px-10 py-4">
                <Text as="h2" className="font-semibold !text-xl w-full ">
                    Token AWS
                </Text>
                <div className="w-full flex">
                    <InputText
                        type="text"
                        placeholder="ARN"
                        value={arn}
                        onChange={(e) => setArn(e.target.value)}
                        variant="admin"
                    />
                    <Button
                        variant='primary'
                        onClick={handleGetToken}
                        size='md'
                        className="w-2/5 !rounded-full mx-2"
                    >
                        Obtener
                    </Button>
                </div>
                {token && (
                    <>
                        <Text as="p1" className="w-full text-sm" >
                            Token:
                        </Text>
                        <div className='w-full flex items-center'>
                            <>
                                <Text as="p2" className='w-4/5 text-base !break-words'>
                                    {token}
                                </Text>
                                <Button
                                    variant='primary-admin'
                                    iconSize='xxs'
                                    onClick={handleCopyToken}
                                    icon={<ClipboardIcon />}
                                    size='md'
                                    className="w-2/5 !rounded-full mx-4"
                                >
                                </Button>
                            </>
                        </div>
                    </>
                )}
                {copied && (
                    <Text as="p2" className="text-center text-success mt-2 shadow-xl">
                        Token copiado
                    </Text>
                )}
                {error && (
                    <Text as="p2" className="text-center text-danger mt-2 shadow-xl">
                        No se encontro el token
                    </Text>
                )}
            </div>
        </Modal >
    )
}
