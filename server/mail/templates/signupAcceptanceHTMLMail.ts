const signupAcceptanceHTMLMail = (firstName: string, lastName: string) =>
  `
<div>
¡Hola ${firstName} ${lastName}!<br>
<br>
Nos complace informarte que tu solicitud para formar parte de Delta ha sido aprobada.
<br>
Si en algún momento necesitas ponerte en contacto con nuestro equipo, no dudes en escribirnos a sistemas@delta.org. Estaremos encantados de brindarte asistencia y responder a todas tus consultas.<br>
<br>
Te invitamos a acceder a la plataforma a través del siguiente enlace: <a href="${process.env.BASE_URL}">${process.env.BASE_URL}</a>.<br>
<br>
Atentamente,<br>
<br>
El equipo de Delta<br>
</div>
`;

export default signupAcceptanceHTMLMail;
