import { UserRole } from '@prisma/client';

const roleDict: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  COLLABORATOR: 'Colaborador',
};

export default roleDict;
