import React from 'react';
type AvailabilityFieldProps = {
  availability: string;
  onChange: (event: { [key: string]: any }) => void;
  from?: string;
  to?: string;
};

export const AvailabilityField = (props: AvailabilityFieldProps) => {
  const { from, to, availability, onChange: handleFieldChange } = props;
  const sanitizedTime = (time: string) => {
    let sanitizedTime = time;
    if (sanitizedTime.length === 3 && !sanitizedTime.includes(':')) {
      sanitizedTime = `${sanitizedTime.slice(0, 2)}:${sanitizedTime[2]}`;
    }
    return sanitizedTime.substring(0, 5).replace(/[^\d:]/g, '');
  };
  const handleTimeFieldChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    /*let timeToUpdate = sanitizedTime(value);*/
    handleFieldChange({ [name]: value });
  };
  return (
    <>
      <h1 className={'my-4 text-justify font-bold text-black'}>
        ¿En qué horario está abierto?
      </h1>
      <div className={'flex justify-between mt-6 items-center'}>
        {/*<p className={"mr-6"}>De</p>
  <input
    name={"workingHourFrom"}
    className={"rounded-lg p-3 w-full border border-light-gray focus:outline-0 "}
    placeholder={"00:00"}
    onChange={handleTimeFieldChange}
    value={from}
  />
  <p className={"mx-6"}>a</p>
  <input

    name={"workingHourTo"}
    className={"rounded-lg p-3 w-full border border-light-gray focus:outline-0"}
    placeholder={"23:59"}
    onChange={handleTimeFieldChange}
    value={to}
  />*/}
        <input
          name={'availability'}
          className={
            'rounded-lg p-3 w-full border border-light-gray focus:outline-0 '
          }
          placeholder={'Lunes-Viernes 07:00-19:00'}
          onChange={handleTimeFieldChange}
          value={availability}
        />
      </div>
    </>
  );
};
