import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import TipTapEditor from '../../../components/molecules/TipTapEditor';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/molecules/Buttons/Button';
import Loading from '../../../components/atoms/Loading';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';

type AboutContentProps = {
  id?: string,
  text?: string,
}

export type FaqContentProps = {
  id?: string,
  question?: string,
  answer?: string,
}

type ContenidoProps = {
  aboutContent: AboutContentProps[];
  // faqContent: FaqContentProps[];
};

const getAboutSectionContent = async (id?: string) => {
  return await axios.get('/api/about', {
    params: {
      id,
    }
  });
};

const setAboutSectionContent = async (id?: string, text?: string) => {
  return await axios.put('/api/admin/about',
    {
      id,
      text,
    },
    {
      params: {
        id
      },
    }
  )
}

const getFaqsSectionContent = async (id?: string) => {
  return await axios.get('/api/faq', {
    /* params: {
      id,
    } */
  });
};

const setFaqsSectionContent = async (id?: string, question?: string, answer?: string) => {
  return await axios.put('/api/admin/faq',
    {
      id,
      question,
      answer,
    },
    /* {
      params: {
        id
      },
    } */
  )
}

const newFaqsSectionContent = async (question?: string, answer?: string) => {
  return await axios.post('/api/admin/faq',
    {
      question,
      answer,
    },
    /* {
      params: {
        id
      },
    } */
  )
}

const removeFaqsSectionContent = async (id?: string) => {
  return await axios.delete('/api/admin/faq',
    {
      data: { id },
    }
  );
};

// @ts-ignore
const Contenido: NextPage<ContenidoProps> = ({ aboutContent: initialAboutContent }) => {
  const [aboutContent, setAboutContent] = useState<AboutContentProps[]>([]);
  const [faqContent, setFaqContent] = useState<FaqContentProps[]>([]);
  const [showNewFaq, setShowNewFaq] = useState<boolean>(false);
  const faqsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('about-us');

  useEffect(() => {
    getAboutSectionContent('about').then((response) => {
      setAboutContent([...response.data]);
    });
    getFaqsSectionContent().then((response) => {
      setFaqContent([...response.data]);
    });
  }, []);

  const handleAddNewFaq = () => {
    setShowNewFaq(true);

    newFaqsSectionContent('Nueva Pregunta', 'Respuesta').then(() => {
      getFaqsSectionContent().then((response) => {
        setFaqContent([...response.data]);
        setShowNewFaq(false);
        if (faqsRef.current) {
          faqsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });
    });
  };

  const handleRemoveFaq = (id: string) => {
    setShowNewFaq(true);

    removeFaqsSectionContent(id).then(() => {
      getFaqsSectionContent().then((response) => {
        setFaqContent([...response.data]);
        setShowNewFaq(false);

      });
    });

  }

  const handleTabClick = (tabId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveTab(tabId);
  };


  return (
    <div ref={faqsRef} className="bg-box-background h-screen">
      <AdminLayout title="Contenido">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
          <li className="mr-2">
            <a
              href="#about-us"
              aria-current="page"
              className={`inline-block p-4 rounded-t-lg ${activeTab === 'about-us' ? 'active text-white bg-primary' : ''
                }`}
              onClick={(event) => handleTabClick('about-us', event)}
            >
              Sobre Delta
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#faq"
              className={`inline-block p-4 rounded-t-lg ${activeTab === 'faq' ? 'active text-white bg-primary' : ''
                }`}
              onClick={(event) => handleTabClick('faq', event)}
            >
              FAQs
            </a>
          </li>
        </ul>
        <div id="about-us" className={activeTab === 'about-us' ? '' : 'hidden'}>
          <h2 className='text-lg text-black font-bold my-2 mb-8'>Sobre Delta</h2>
          {aboutContent && aboutContent.map((currentContent, index) => (
            <TipTapEditor key={index} id={currentContent.id} content={currentContent.text} callback={setAboutSectionContent} />
          ))}
        </div>
        <div id="faq" className={activeTab === 'faq' ? '' : 'hidden'}>
          <div className='flex justify-between'><h2 className='text-lg text-black font-bold my-2'>FAQs</h2>
            <Button
              className={'my-3 p-0'}
              type={"button"}
              variant={'secondary'}
              onClick={handleAddNewFaq}
              icon={<PlusCircleIcon className={'h-6 w-5'} />}
            >
              Agregar FAQ
            </Button></div>
          {showNewFaq || !faqContent ?
            <div className="flex items-center justify-center h-32"> <Loading /></div>
            : (
              faqContent.map((faq, index) => {
                return (
                  <div key={index}>
                    <div>
                      <TipTapEditor id={faq.id} content={faq.question} callback={setFaqsSectionContent} answer={faq.answer} faqContent={faqContent} onSetFaqContent={setFaqContent} />
                      <TipTapEditor id={faq.id} content={faq.answer} callback={setFaqsSectionContent} question={faq.question} />
                    </div>
                    <div>
                      <button
                        className='my-5 mr-4 lg:max-w-sm px-3 font-bold lg:max-h-14 rounded-xl border border-primary text-white bg-primary'
                        onClick={() => faq.id && handleRemoveFaq(faq.id)}
                      >
                        Eliminar FAQ
                      </button>
                    </div>
                    <hr className='bg-primary mb-8' />
                  </div>
                )
              }))
          }
        </div>
      </AdminLayout>
    </div>

  )
};


export default Contenido;