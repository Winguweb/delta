import axios from 'axios';
import { DeviceCoordinates } from './deviceCoordinates';
import { prismaClient } from '../prisma/client';
import { computeDistanceBetween } from 'spherical-geometry-js';
import { MIN_DISTANCE } from './notifierConfig';
import { nowWithTimezone, todayAtStartOfDayWithTimezone } from '../../utils/dates';
import { sendWhatsappNotification } from './whatsappService';

const http = axios.create({
  baseURL: process.env.NOTIFIER_URL,
});

type Sample = {
  id: number,
  name: string,
  samplingPointId: string | null,
  deviceId: number,
  latitude: number,
  longitude: number,
  takenById: string,
  takenAt: Date
}

export async function onSampleUpload(sample: Sample) {
  try {
    await findUsersToNotify({ deviceId: sample.deviceId, latitude: sample.latitude, longitude: sample.longitude });
    const token = await authenticate();
    const headers = { 'Authorization': 'Bearer ' + token };
    const res = await http.post(
      '/onUpdate',
      sample,
      { headers: headers },
    );
    return res.data;
  } catch (err: any) {
    console.error('[NotifierService] error');
  }
}

async function authenticate() {
  try {
    const body = { privateKey: process.env.NOTIFIER_SECRET };
    const res = await http.post('/auth', body);
    return res.data.token;
  } catch (err: any) {
    console.error('[NotifierService][Auth] error');
  }
}

async function findUsersToNotify(coords: DeviceCoordinates) {
  const firstHourToday = todayAtStartOfDayWithTimezone();
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
  const usersNotified: string[] = [];
  users.forEach(user => {
    const distance = computeDistanceBetween({ lat: coords.latitude, lng: coords.longitude }, {
      lat: user.latitude,
      lng: user.longitude,
    });
    if (distance <= MIN_DISTANCE) {
      sendWhatsappNotification(user.telephone);
      usersNotified.push(user.id);
    }
  });
  const today = nowWithTimezone();
  await prismaClient.notifyOrder.updateMany({
    where: {
      id: {
        in: usersNotified,
      },
    },
    data: {
      lastNotifiedAt: today,
    },
  });
}