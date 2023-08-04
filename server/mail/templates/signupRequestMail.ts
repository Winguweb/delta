const signupRequestMail = (
  firstName: string,
  lastName: string
) =>
  `
¡Hola!
${firstName} ${lastName} solicitó sumarse para colaborar con Delta.
Ingresá a ${process.env.BASE_URL} para más información.
`;

export default signupRequestMail;
