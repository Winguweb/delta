const countriesData = [
  { name: 'Belice', code: 'BZ' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Panamá', code: 'PA' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Brasil', code: 'BR' },
  { name: 'Chile', code: 'CL' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Guyana Francesa', code: 'GF' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Perú', code: 'PE' },
  { name: 'Surinam', code: 'SR' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Antigua y Barbuda', code: 'AG' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Haití', code: 'HT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Martinica', code: 'MQ' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'República Dominicana', code: 'DO' },
  { name: 'Trinidad y Tobago', code: 'TT' },
  { name: 'México', code: 'MX' },
];

const countries = countriesData.sort(function (a, b) {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
});

export default countries;
