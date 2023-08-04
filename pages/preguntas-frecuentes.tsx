import {
  ChevronDownIcon,
  ChevronLeftIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Head from 'next/head';
import { HTMLProps, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';


export const FAQLink = (props: HTMLProps<HTMLAnchorElement>) => {
  const { className, children, ...rest } = props;
  return (
    <a className={classNames('text-primary', className)} {...rest}>
      {children}
    </a>
  );
};

type AccordionItemProps = {
  children?: ReactNode;
  title: ReactNode;
};

type ContentProps = {
  id?: string,
  question?: string,
  answer?: string,
}

const handleHtml = (content: any) => {
  if (content) {
    return {
      __html: content,
    }
  }
}

const getSectionContent = async (id?: string) => {
  return await axios.get('/api/faq', {
    /* params: {
      id,
    } */
  });
};


const AccordionItem = (props: AccordionItemProps) => {
  const { children, title } = props;
  const [open, setOpen] = useState(false);

  const ChevronIcon = open ? ChevronDownIcon : ChevronLeftIcon;

  return (
    <div className={'flex flex-col rounded-2xl border-2 w-full my-4'}>
      <button className={'py-4 flex flex-row w-full cursor-pointer'} onClick={() => setOpen(!open)}>
        <QuestionMarkCircleIcon className={'h-6 w-5 text-primary mx-4'} />
        {/* <p className={'text-l font-title text-black font-semibold'}></p> */}
        <div className='text-l font-title text-black font-semibold' dangerouslySetInnerHTML={handleHtml(title)}></div>
        <div className={'ml-auto'}>
          <ChevronIcon className={'h-6 w-5 text-primary mx-4'} />
        </div>
      </button>
      {open && <div className="px-8 my-4" dangerouslySetInnerHTML={handleHtml(children)}></div>}
    </div>
  );
};

export default function FAQs() {
  const [content, setContent] = useState<ContentProps[]>();

  useEffect(() => {
    getSectionContent().then((response) => {
      setContent(response.data);
    })
  }, [])
  return (
    <>
      <Head>
        <title>Delta - Preguntas Frecuentes</title>
      </Head>
      <main className={'px-6 my-2 lg:mx-auto lg:w-desktop'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>
          Preguntas frecuentes
        </h1>
        <ul>
          {content?.map((item, index) => (
            <li key={index}>
              <AccordionItem title={item.question}>{item.answer}</AccordionItem>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
