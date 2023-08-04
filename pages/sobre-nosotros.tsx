import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HTMLProps, useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/molecules/Buttons/Button';

type AboutProps = {
  id?: string,
  text?: string,
}

function ComenzarBusquedaButton() {
  const router = useRouter();
  return (
    <Button
      className={'w-full my-5 lg:mx-auto lg:max-w-sm'}
      variant={'secondary'}
      onClick={() => {
        router.push('/');
      }}
    >
      Comenzar Búsqueda
    </Button>
  );
}

const getAbouts = async (id: string) => {
  return await axios.get('/api/about', {
    params: {
      id,
    }
  });
};

// @ts-ignore
export default function About(props) {
  const [abouts, setAbouts] = useState<AboutProps[]>();

  const handleHtml = (about: AboutProps) => {
    if (about.text) {
      return {
        __html: about.text,
      }
    }
  }

  useEffect(() => {
    getAbouts('about').then((response) => {
      setAbouts(response.data);
    })
  }, [])
  
  return (
    <>
      <Head>
        <title>Delta- Sobre Delta</title>
      </Head>

      <main className={'px-6 my-2 lg:mx-auto lg:max-w-desktop'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>Sobre Delta</h1>
        {abouts && abouts.map((about, key) => (
          <div key={key} className='' dangerouslySetInnerHTML={handleHtml(about)}></div>
        ))}
        <p className={'my-4 p-2 text-dark rounded-2xl text-center'}>
          Si tenés inquietudes, visitá nuestra sección de{' '}
          <Link href="/preguntas-frecuentes">
            <span className={' font-bold'}>
              preguntas frecuentes
            </span>
          </Link>
        </p>

        <ComenzarBusquedaButton />
      </main>
    </>
  );
}
