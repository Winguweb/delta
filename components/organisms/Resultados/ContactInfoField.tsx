type ContactInfoFieldProps = {
  onChange: (event: { currentTarget: { value: string; name: string } }) => void;
  website: string | null;
  phone?: string;
  whatsApp?: string;
  email?: string;
};

export const ContactInfoField = (props: ContactInfoFieldProps) => {
  const { onChange, website, phone, whatsApp, email } = props;
  return (
    <>
      <h2 className={'my-2 text-justify font-bold text-black'}>
        Datos de contacto del establecimiento
      </h2>
      <input
        name={'website'}
        pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
        className={
          'rounded-lg p-3 w-full border border-light-gray focus:outline-0  invalid:bg-red-400 invalid:font-semibold'
        }
        placeholder={'Sitio web: https://ejemplo.org'}
        onChange={onChange}
        value={website ? website : undefined}
      />
      {/* <input
        name={'phone'}
        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
        placeholder={'Teléfono'}
        onChange={onChange}
        value={phone}
      />
      <input
        name={'whatsApp'}
        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
        placeholder={'WhatsApp'}
        onChange={onChange}
        value={whatsApp}
      />
      <input
        name={'email'}
        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
        placeholder={'Email'}
        onChange={onChange}
        value={email}
      /> */}
    </>
  );
};
