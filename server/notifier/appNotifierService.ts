import axios from 'axios';
import { DeviceCoordinates } from './deviceCoordinates';

const http = axios.create({
  baseURL: process.env.NOTIFIER_URL
});

export async function onSampleUpload(coordinates: DeviceCoordinates) {
  try {
    const res = await http.post('/onUpdate', coordinates);
    return res.data;
  } catch (err) {
    console.error(err);
  }
}