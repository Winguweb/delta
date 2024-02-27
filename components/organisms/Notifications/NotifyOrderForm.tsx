import React from 'react';
import Text from '../../molecules/Text';
import { Button } from '../../molecules/Buttons/Button';
import { IconLocation } from '../../../assets/icons/IconLocation';
import MainContainer from '../MainContainer';
import { UseFormReturn } from 'react-hook-form';
import axios from 'axios';
import { Coordinates } from '../../../model/map';
import { NotifyOrderFormValues } from '../../../pages/notificaciones';

export type NotifyOrderFormProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>,
  form: UseFormReturn<NotifyOrderFormValues>,
  coords: Coordinates | null,
}

export const NotifyOrderForm: React.FC<NotifyOrderFormProps> = ({ form, setShowModal, setShowMap, coords }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const handleNotifyOrder = async (values: any) => {
    await axios.post(`/api/notify-orders`, { telephone: values.telephone, location: values.location }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(value => setShowModal(true))
      .catch(error => console.log(error));
  };

  return (
    <>
      <MainContainer
        className={
          'w-full h-full flex flex-col lg:flex-row justify-center lg:space-x-28 px-4 py-4 lg:py-16 !shadow-none'
        }
        bg={'bg-main-image'}
      >
        <div className="w-full flex justify-center pb-6 lg:pb-0">
          <form
            className={'h-fit bg-white w-full lg:w-2/3 rounded-2xl shadow-main'}
            onSubmit={handleSubmit(handleNotifyOrder)}
          >
            <div className=" rounded-2xl p-5 lg:p-12 space-y-4">
              <Text as="h2" className="text-center">
                Activar notificaciones
              </Text>
              <p>
                Podemos enviarte una notificación por WhatsApp cuando tu servicio se encuentre cerca de tu ubicación.
              </p>
              <div className="mb-6">
                <label
                  htmlFor="telephone"
                  className="block mb-2 font-semibold"
                >
                  Número de teléfono
                </label>
                <div className="flex">
                  <p className="m-auto mr-1 text-nowrap">
                    (+54)
                  </p>
                  <input
                    {...register('telephone')}
                    id="telephone"
                    name="telephone"
                    className="input-style placeholder-icon"
                    placeholder="1123456789"
                  />
                </div>

                <p className="text-danger text-sm">{errors.telephone?.message}</p>

              </div>
              <div className="mb-8">
                <div className="lg:flex">
                  <Button
                    icon={<IconLocation fill="#3c33ff" />}
                    iconSize="xxs"
                    variant="secondary"
                    size="md"
                    iconColor="primary"
                    className="text-primary"
                    onClick={() => setShowMap(true)}
                  >
                    Seleccionar Ubicación
                  </Button>
                  {coords && (
                    <div className="flex col-span-2">
                      <input
                        type="number"
                        className="input-style placeholder-icon"
                        readOnly={true}
                        value={coords?.lat}
                      />
                      <input
                        type="number"
                        className="input-style placeholder-icon"
                        readOnly={true}
                        value={coords?.lng}
                      />

                    </div>
                  )}
                </div>
                <p className="text-danger mt-1 text-sm">{errors.location?.lat?.message}</p>
              </div>
              <div className="mb-6">
                <button type="submit" className="btn-primary">
                  Confirmar
                </button>
              </div>
            </div>
          </form>
        </div>
      </MainContainer>
    </>);
};