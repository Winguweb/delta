import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';
import FormContainer from './components/FormContainer';
import { Button } from '../../../../../molecules/Buttons/Button';
import Text from '../../../../../molecules/Text';
import { IconTrash } from '../../../../../../assets/icons';

interface RelationOnSamplingPointFormProps {
  title: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onCancelCb?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  isEditing?: boolean;
  onDelete?: ()=>void;
}

const RelationOnSamplingPointForm: React.FC<
  RelationOnSamplingPointFormProps
> = ({ title, onCancelCb, onSubmit, onDelete, disabled = false, isEditing, children: formChildren }) => {
  return (
    <div className="p-8 bg-white flex flex-col space-y-5 ">
      <Text as="h2" className="w-full lg:w-3/5">
        {title}
      </Text>

      <form className="w-full flex flex-col space-y-6" onSubmit={onSubmit}>
        {formChildren}

        <FormContainer className="flex space-x-4 w-full">
          <div className='w-full flex lg:flex-row flex-col space-y-4 lg:space-y-0 lg:justify-between'>
            {isEditing &&
              <Button
                onClick={onDelete}
                variant="primary-admin"
                iconSize='xxs'
                icon={<IconTrash />}
                iconColor={'danger'}
                className={'!text-danger'}
              >
                Eliminar Muestra
              </Button>
            }
            <div className='flex lg:flex-row flex-col space-y-2 lg:space-y-0 space-x-0 lg:space-x-2'>
              {onCancelCb && (
                <Button
                  variant="secondary"
                  className="w-full !rounded-full"
                  onClick={onCancelCb}
                >
                  Cancelar
                </Button>
              )}

              <Button
                variant="secondary"
                className="w-full !bg-primary !text-white !rounded-full"
                icon={<CheckIcon />}
                iconSize='xs'
                iconColor='white'
                disabled={disabled}
                type="submit"
              >
                Guardar
              </Button>
            </div>
          </div>
        </FormContainer>
      </form>
    </div>
  );
};

export default RelationOnSamplingPointForm;
