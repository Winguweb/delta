const signupAcceptanceMail = (firstName: string, lastName: string) =>
  `
¡Hola ${firstName} ${lastName}!

Nos complace informarte que tu solicitud para formar parte de Delta ha sido aprobada.

Si en algún momento necesitas ponerte en contacto con nuestro equipo, no dudes en escribirnos a sistemas@delta.org. Estaremos encantados de brindarte asistencia y responder a todas tus consultas.

Te invitamos a acceder a la plataforma a través del siguiente enlace: ${process.env.BASE_URL}.

Atentamente,

El equipo de Delta
`;

export default signupAcceptanceMail;
