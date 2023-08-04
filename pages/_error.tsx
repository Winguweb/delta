import React from 'react';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Text from '../components/molecules/Text';
import { Button } from '../components/molecules/Buttons/Button';

interface ErrorProps {
    statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
    const router = useRouter();
    let message = 'This page could not be found.';

    if (statusCode === 404) {
        message = 'La página que buscas no se pudo encontrar.';
    } else if (statusCode === 500) {
        message = 'Ocurrió un error interno en el servidor.';
    }

    return (
        <div className="bg-main-image flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="w-full flex justify-center pb-8">
                    <Image
                        src="/assets/Logo.svg"
                        alt="Delta Logo White"
                        height={58}
                        width={200}
                    />
                </div>
                <Text as={'h2'}>{message}</Text>
                <div className='flex justify-center mt-2'>
                    <Button
                        variant='tertiary'
                        onClick={() => router.push('/')}
                    >
                        Volver a la página de inicio
                    </Button>
                </div>

            </div>
        </div>
    );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res?.statusCode || err?.statusCode || 404;
    return { statusCode };
};

export default Error;
