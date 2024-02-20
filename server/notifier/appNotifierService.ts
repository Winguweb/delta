import axios from 'axios';
import { DeviceCoordinates } from './deviceCoordinates';

const http = axios.create({
  baseURL: process.env.NOTIFIER_URL,
});

export async function onSampleUpload(coordinates: DeviceCoordinates) {
  try {
    const token = await authenticate();
    const headers = { 'Authorization': 'Bearer ' + token };
    const res = await http.post(
      '/onUpdate',
      coordinates,
      { headers: headers },
    );
    return res.data;
  } catch (err: any) {
    console.error('[NotifierService] error:', err.response.data.error);
  }
}

async function authenticate() {
  try {
    const body = { privateKey: process.env.NOTIFIER_SECRET };
    const res = await http.post('/auth', body);
    return res.data.token;
  } catch (err: any) {
    console.error('[NotifierService][Auth] error:', err.response.data.error);
  }
}