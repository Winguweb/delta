import axios from 'axios';
import { DeviceCoordinates } from './deviceCoordinates';
import { prismaClient } from '../prisma/client';
import { computeDistanceBetween } from 'spherical-geometry-js';
import { MIN_DISTANCE } from './notifierConfig';

const http = axios.create({
  baseURL: process.env.NOTIFIER_URL,
});

export async function onSampleUpload(coordinates: DeviceCoordinates) {
  try {
    await findUsersToNotify(coordinates);
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

async function findUsersToNotify(coords: DeviceCoordinates) {
  const firstHourToday = new Date();
  firstHourToday.setHours(-3, 0, 0, 0);
  const users = await prismaClient.notifyOrder.findMany({
    where: {
      OR: [
        {
          lastNotifiedAt: null,
        },
        {
          lastNotifiedAt: {
            lte: firstHourToday,
          },
        },
      ],
    },
  });
  users.forEach(user => {
    const distance = computeDistanceBetween({ lat: coords.latitude, lng: coords.longitude }, {
      lat: user.latitude,
      lng: user.longitude,
    });
    if (distance <= MIN_DISTANCE) {
      console.log('[NotifierService] sending WhatsApp notification');
    }
  });
  const today = new Date();
  today.setHours(today.getHours() - 3);
  await prismaClient.notifyOrder.updateMany({
    where: {
      id: {
        in: users.map(user => user.id),
      },
    },
    data: {
      lastNotifiedAt: today,
    },
  });
}