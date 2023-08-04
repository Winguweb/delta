import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import IconButton from './Buttons/IconButton';
import Text from './Text';

interface TagProps {
  label: string;
  onClickDelete: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onClickDelete }) => {
  return (
    <div className="flex space-x-2 items-center text-primary border border-primary w-fit rounded-4xl py-2 px-4">
      <Text as="p2" className="font-medium">
        {label}
      </Text>
      <IconButton
        icon={<XMarkIcon />}
        iconSize="small"
        className="w-4 h-4"
        onClick={onClickDelete}
      />
    </div>
  );
};

export default Tag;
