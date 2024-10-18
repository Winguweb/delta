import { UserRole } from '@prisma/client';

const roleDict: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  COLLABORATOR: 'Colaborador',
  PROVIDER: 'Proveedor'
};

export default roleDict;
