import axios from 'axios';

const http = axios.create({
  baseURL: process.env.WHATSAPP_API_URL,
  headers: { 'Authorization': 'Bearer ' + process.env.WHATSAPP_API_TOKEN },
});

export async function sendWhatsappNotification(telephone: string) {
  try {
    await http.post(
      '/messages',
      {
        'messaging_product': 'whatsapp',
        to: telephone,
        type: 'template',
        template: {
          name: 'deltapp',
          'language': {
            'code': 'es',
          },
        },
      },
    );

  } catch (error: any) {
    console.error('[Whatsapp API] error:', error.response.data.error);
  }
}
