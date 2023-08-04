const resetPasswordMail = (firstName: string, lastName: string, email: string, token: string) =>
  `
Hola ${firstName} ${lastName},

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en la plataforma Delta. Entendemos lo importante que es acceder a tu cuenta, por lo que hemos preparado un proceso sencillo y seguro para ayudarte a recuperar el acceso.

Para restablecer tu contraseña, por favor sigue estos pasos:

1. Hacé click acá (${process.env.BASE_URL}/nueva-contrasenia?email=${email}&token=${token}) para acceder a la página de restablecimiento de contraseña

2. Serás redirigido/a a una página segura donde podrás ingresar una nueva contraseña. Asegúrate de elegir una contraseña segura y que no hayas utilizado previamente en esta plataforma.

Si no has solicitado restablecer tu contraseña o crees que esto pueda ser un error, te pedimos que ignores este mensaje y tomes las precauciones necesarias para mantener tu cuenta segura.

Si tienes alguna pregunta o necesitas asistencia adicional, por favor no dudes en contactar a nuestro equipo de soporte técnico. Estaremos encantados de ayudarte.

Atentamente,

El equipo de Delta
`;

export default resetPasswordMail;
