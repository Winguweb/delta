import { UserStatus } from '@prisma/client';
import statusDictionary from '../../../../utils/statusDictionary';

interface StatusTagProps {
  status: UserStatus;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const dangerBgColor = 'bg-[#DD2A031A]';

  const statusBgColor = {
    PENDING: 'bg-box-background',
    ACTIVE: 'bg-white',
    BLOCKED: dangerBgColor,
    INACTIVE: dangerBgColor,
  }[status];

  const label = statusDictionary[status];

  const dangerTextColor = 'text-danger';

  const textColor = {
    PENDING: 'text-black',
    ACTIVE: 'text-primary',
    BLOCKED: dangerTextColor,
    INACTIVE: dangerTextColor,
  }[status];

  const border = {
    PENDING: '',
    ACTIVE: 'border border-primary',
    BLOCKED: '',
    INACTIVE: '',
  }[status];

  return (
    <span
      className={`${textColor} ${border} ${statusBgColor} py-2 px-3 rounded-full text-sm`}
    >
      {label}
    </span>
  );
};

export default StatusTag;
