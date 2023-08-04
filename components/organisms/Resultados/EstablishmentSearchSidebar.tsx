import React from 'react';
import { Pill } from '../../atoms/Pill';

type Props = React.PropsWithChildren<{
  services: { id: string; name: string }[];
}>;

const EstablishmentSearchSidebar = React.memo<Props>((props) => {
  const { children, services } = props;
  return (
    <>
      <div className=" px-5 flex flex-wrap justify-start ml-20 mt-4">
        <div className={'mt-4 mb-6'}>
          <p className="text-black text-sm mb-2">Estás buscando</p>
          <div className="flex">
            {services.map((service) => (
              <Pill
                type={'secondary'}
                className={'text-dark-gray py-1 mr-2 h-fit'}
                key={service.id}
              >
                {service.name}
              </Pill>
            ))}
          </div>
        </div>

        <h2 className={'font-title text-2xl text-black font-bold'}>
          ¿En qué lugar estás buscando?
        </h2>
        <div className={''}>
          <p className={'text-sm text-black my-4'}>
            Podés buscar por ciudad, departamento o barrio. También podés buscar
            por el nombre o la dirección de un centro que ya conozcas.
          </p>
          {children}
        </div>
      </div>
    </>
  );
});

export default EstablishmentSearchSidebar;
