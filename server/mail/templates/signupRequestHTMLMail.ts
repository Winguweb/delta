const signupRequestHTMLMail = (
  firstName: string,
  lastName: string
) =>
  `
<div>
¡Hola!<br>
${firstName} ${lastName} solicitó sumarse para colaborar con Delta.<br>
Ingresá <a href="${process.env.BASE_URL}">acá</a> para más información.<br>
</div>
`;

export default signupRequestHTMLMail;
