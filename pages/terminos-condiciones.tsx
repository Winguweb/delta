import Head from 'next/head';
import { FAQLink } from './preguntas-frecuentes';

const TerminosCondiciones = () => {
  return (
    <>
      <Head>
        <title>
          Delta - Términos, condiciones y la publicación de los datos en el
          sitio
        </title>
      </Head>

      <main className={'px-6 my-2 lg:mx-auto lg:max-w-desktop'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>
          Términos, condiciones y la publicación de los datos en el sitio
        </h1>
        <p className={'text-base text-justify mb-6'}>
          Gracias por utilizar <strong>#Delta.</strong>
        </p>
        <p className={'text-base text-justify mb-6'}>
          En <strong>#Delta</strong> podés encontrar...
        </p>
        <p className={'text-base text-justify mb-6'}>
          Texto...
        </p>
      </main>
    </>
  );
};

export default TerminosCondiciones;
