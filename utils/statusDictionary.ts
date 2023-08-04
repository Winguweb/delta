import { UserStatus } from '@prisma/client';

const statusDictionary: Record<UserStatus, string> = {
  PENDING: 'Pendiente',
  ACTIVE: 'Activo',
  BLOCKED: 'Rechazada',
  INACTIVE: 'Inactivo',
};

export default statusDictionary;
