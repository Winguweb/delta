import { createTransport } from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

export type SendMailProperties = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendMail = async ({
  to,
  subject,
  text,
  html,
}: SendMailProperties) => {
  if (!process.env.MAILER_APP_EMAIL || !process.env.MAILER_OAUTH2_CLIENT_ID || 
        !process.env.MAILER_OAUTH2_CLIENT_SECRET || !process.env.MAILER_OAUTH2_REFRESH_TOKEN || 
         !process.env.MAILER_OAUTH2_CLIENT_REDIRECT_URI) {
      throw new Error('Missing one of env variables for mailing functionality');
  }
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.MAILER_OAUTH2_CLIENT_ID,
      process.env.MAILER_OAUTH2_CLIENT_SECRET,
      process.env.MAILER_OAUTH2_CLIENT_REDIRECT_URI,
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.MAILER_OAUTH2_REFRESH_TOKEN
    });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = createTransport({
      // @ts-ignore
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAILER_APP_EMAIL,
        clientId: process.env.MAILER_OAUTH2_CLIENT_ID,
        clientSecret: process.env.MAILER_OAUTH2_CLIENT_SECRET,
        refreshToken: process.env.MAILER_OAUTH2_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    await transporter.sendMail({
      from: process.env.MAILER_APP_EMAIL,
      to,
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
    return error;
  }
};
