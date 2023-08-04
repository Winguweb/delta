import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Button } from '../../../molecules/Buttons/Button';
import { GetUserResponse } from '../../../../model/user';

interface UserDetailProps {
  data: GetUserResponse;
  onAccept: () => void;
  onReject: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({
  data,
  onAccept,
  onReject,
}) => {
  return (
    <div className="flex items-left justify-center flex-col px-8 py-6 rounded-b">
      <div className="w-full">
        <h2 className="text-2xl font-semibold py-2 text-black">
          {data.firstName} {data.lastName}
        </h2>

        <ul>
          <li>{data.email}</li>
          <li>Nombre de la organización: {data.organizationName}</li>
          <li>País: {data.organizationCountry.name}</li>
          <li>Rol: {data.organizationRole}</li>
        </ul>
      </div>

      <div className="w-full flex justify-end space-x-4">
        <Button
          onClick={onReject}
          variant="secondary"
          icon={<XMarkIcon />}
          iconSize="small"
          className="border border-danger text-danger"
        >
          Rechazar
        </Button>
        <Button onClick={onAccept} icon={<CheckIcon />} iconSize="small">
          Aprobar
        </Button>
      </div>
    </div>
  );
};

export default UserDetail;
