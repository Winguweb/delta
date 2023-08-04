import { BookmarkSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { NewsPost, NewsPostStatus } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { z } from 'zod';
import InputText from '../../../molecules/Input/InputText';
import { Button } from '../../../molecules/Buttons/Button';
import Text from '../../../molecules/Text';
import checkErrors from '../../../../utils/checkErrors';
import { StatusTag } from '../../../../pages/admin/news-posts';
import { Modal } from '../../Modal';

const newsPostSchema = z.object({
  title: z.string().min(3, 'El título es requerido').max(100, 'El título puede tener un máximo de 100 caracteres'),
  description: z.string().min(3, 'La descripción es requerida').max(280, 'La descripción puede tener un máximo de 280 caracteres'),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(NewsPostStatus),
});

type Data = z.infer<typeof newsPostSchema>;

type Errors = Record<keyof Data, string>;

type Reducer = (
  state: Data,
  action: { type: string; payload: Data[keyof Data] }
) => Data;

interface NewsPostFormProps {
  type: 'create' | 'update';
  newsPost?: Omit<NewsPost, 'startDate' | 'endDate'> & {
    startDate: string;
    endDate: string;
  };
}

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

const initialErrors: Errors = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
};

const NewsPostForm: React.FC<NewsPostFormProps> = ({ newsPost: foundNewsPost, type }) => {
  const initialData: Data = {
    create: {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      status: NewsPostStatus.DRAFT,
    },
    update: {
      title: foundNewsPost?.title || '',
      description: foundNewsPost?.description || '',
      startDate:
        (foundNewsPost?.startDate && new Date(foundNewsPost.startDate)) || new Date(),
      endDate: (foundNewsPost?.endDate && new Date(foundNewsPost.endDate)) || new Date(),
      status: foundNewsPost?.status || NewsPostStatus.DRAFT,
    },
  }[type];

  const [data, setData] = React.useReducer(reducer, initialData);
  const [errors, setErrors] = React.useState<Errors>(initialErrors);
  const [showModal, setShowModal] = useState(false);

  const handleSubmitCreate = async (status: NewsPostStatus) => {
    
    const errors = checkErrors(newsPostSchema, data, initialErrors);
    
    if (Object.values(errors).some((error) => error !== '')) {
      setErrors(errors);
      return;
    }

    try {
      await axios.post('/api/news-posts', {
        ...data,
        status,
      });
      setShowModal(true);
    } catch (error) {
      console.error(error);
      window.alert('Error al crear la noticia');
    }
  };

  const handleSubmitUpdate = async (status: NewsPostStatus) => {
    const errors = checkErrors(newsPostSchema, data, initialErrors);

    if (Object.values(errors).some((error) => error !== '')) {
      setErrors(errors);
      return;
    }

    try {
      await axios.put(`/api/news-posts/${foundNewsPost?.id}`, {
        ...data,
        status,
      });
      setShowModal(true);
    } catch (error) {
      console.error(error);
      window.alert('Error al actualizar la noticia');
    }
  };

  const handleSubmit = {
    create: handleSubmitCreate,
    update: handleSubmitUpdate,
  }[type];

  return (
    <form className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 items-start lg:items-end lg:space-y-0 space-y-3">
          <InputText
            label="Fecha de inicio"
            type="date"
            value={data.startDate.toISOString().split('T')[0]}
            error={errors.startDate}
            onChange={(e) => {
              if (e.target.value === '') {
                return;
              }

              setData({
                type: 'startDate',
                payload: new Date(e.target.value),
              });
            }}
            allWrapperClassName="lg:w-48"
          />

          <InputText
            label="Fecha de finalización"
            type="date"
            value={data.endDate.toISOString().split('T')[0]}
            error={errors.endDate}
            onChange={(e) => {
              if (e.target.value === '') {
                return;
              }

              setData({
                type: 'endDate',
                payload: new Date(e.target.value),
              });
            }}
            allWrapperClassName="lg:w-48"
          />

          <div className="mb-3">
            <StatusTag status={data.status} />
          </div>
        </div>

        <div className="flex space-x-6">
          <InputText
            label="Título"
            value={data.title}
            error={errors.title}
            onChange={(e) => {
              setData({
                type: 'title',
                payload: e.target.value,
              });
            }}
            allWrapperClassName="w-96"
          />

        </div>

        <InputText
          label="Descripción"
          value={data.description}
          error={errors.description}
          onChange={(e) => {
            setData({
              type: 'description',
              payload: e.target.value,
            });
          }}
          textarea
        />
      </div>

      <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 space-y-3 lg:space-y-0">
        <Link href="/admin/news-posts">
            <Button icon={<XMarkIcon />}
            iconSize="small" 
            variant="secondary" 
            className='w-full lg:w-32'>Cancelar</Button>
        </Link>

        <Button
          icon={<CheckIcon />}
          iconSize="small"
          className='w-full lg:w-32'
          onClick={() => handleSubmit('PUBLISHED')}
        >
          Publicar
        </Button>

        <Button
          icon={<BookmarkSquareIcon />}
          variant="quaternary"
          iconSize="small"
          onClick={() => handleSubmit('DRAFT')}
        >
          Guardar borrador
        </Button>
      </div>
      {showModal && (
        <Modal
        showModal={showModal}
        width={'w-4/5 lg:w-1/4'}
        className={'flex flex-col pt-12'}
      >
        <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem]">
          <Text as="p1" className="text-center font-semibold pb-4 pt-4">
            {type == 'create' ? 'Noticia creada' : 'Noticia actualizada'}
          </Text>
          <div className="pb-4 lg:pt-3 flex justify-center">
            <button
              className="btn-primary font-bold"
              type="button"
              onClick={() => {
                window.location.reload();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
      )}
    </form>
  );
};

export default NewsPostForm;
