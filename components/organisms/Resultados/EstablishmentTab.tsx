import React from 'react';
import { CardList } from '../Card';
import { GetSamplingPointResponse } from '../../../model/samplingPoint';
import { formatEstablishmentLocation } from '../../../utils/establishments';

type Props = React.PropsWithChildren<{
  activeEstablishment: GetSamplingPointResponse;
}>;

const EstablishmentTab = React.memo<Props>((props) => {
  const { activeEstablishment } = props;
  const [openTab, setOpenTab] = React.useState(-1);

  const addressNotes = null;
  const address = formatEstablishmentLocation(activeEstablishment);

  const getTime = (date: Date) => {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const minutes =
      (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();
    const time = hour + ':' + minutes;
    return time;
  };

  const getDay = (day: string) => {
    switch (day) {
      case 'M':
        return 'Lunes';
      case 'T':
        return 'Martes';
      case 'W':
        return 'Miércoles';
      case 'R':
        return 'Jueves';
      case 'F':
        return 'Viernes';
      case 'S':
        return 'Sábado';
      case 'U':
        return 'Domingo';
    }
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-nowrap pt-3 flex-row overflow-x-auto overflow-y-hidden scroll-style w-auto"
            role="tablist"
          >
            <li className="mr-2 mb-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  'nav-link font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 px-6 py-3 hover:border-transparent hover:bg-gray-100 focus:border-primary block  bg-white ' +
                  (openTab === -1
                    ? 'text-primary border-primary'
                    : 'text-black border-transparent')
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(-1);
                }}
                data-toggle="tab"
                href="#id-info"
                role="tablist"
              >
                Información
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div
                  className={openTab === -1 ? 'block' : 'hidden'}
                  id="id-info"
                >
                  <CardList>
                    <> {address}{' '}
                      {addressNotes && (
                        <span className={'text-xs text-medium-gray'}>
                          - {addressNotes}
                        </span>
                      )}</>

                  </CardList>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default EstablishmentTab;
