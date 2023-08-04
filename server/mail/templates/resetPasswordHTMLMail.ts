const resetPasswordHTMLMail = (firstName: string, lastName: string, email: string, token: string) =>
  `
<div>
Hola ${firstName} ${lastName},<br>
<br>
Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en la plataforma Delta. Entendemos lo importante que es acceder a tu cuenta, por lo que hemos preparado un proceso sencillo y seguro para ayudarte a recuperar el acceso.<br>
<br>
Para restablecer tu contraseña, por favor sigue estos pasos:<br>
<br>
1. Hacé click <a href="${process.env.BASE_URL}/nueva-contrasenia?email=${email}&token=${token}">acá</a> para acceder a la página de restablecimiento de contraseña<br>
<br>
2. Serás redirigido/a a una página segura donde podrás ingresar una nueva contraseña. Asegúrate de elegir una contraseña segura y que no hayas utilizado previamente en esta plataforma.<br>
<br>
Si no has solicitado restablecer tu contraseña o crees que esto pueda ser un error, te pedimos que ignores este mensaje y tomes las precauciones necesarias para mantener tu cuenta segura.<br>
<br>
Si tienes alguna pregunta o necesitas asistencia adicional, por favor no dudes en contactar a nuestro equipo de soporte técnico. Estaremos encantados de ayudarte.<br>
<br>
Atentamente,<br>
<br>
El equipo de Delta<br>
</div>
`;

export default resetPasswordHTMLMail;