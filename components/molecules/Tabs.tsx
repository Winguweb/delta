import classNames from 'classnames';
import React, { useState } from 'react';
import Text from './Text';

interface TabHeaderProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

interface TabsProps {
  headers: string[];
  content: React.ReactNode[];
}

const TabHeader: React.FC<TabHeaderProps> = ({ label, selected, onClick }) => {
  return (
    <div
      className={classNames([
        'border-b border-b-box-background bg-white px-4 py-3',
        { 'border-b-2 border-b-primary': selected },
      ])}
      onClick={onClick}
      role="button"
    >
      <Text as="button-md" className="font-bold">
        {label}
      </Text>
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({ headers, content }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex">
        {headers.map((header, index) => (
          <TabHeader
            key={`header-${index}`}
            selected={index === openIndex}
            onClick={() => {
              setOpenIndex(index);
            }}
            label={header}
          />
        ))}
      </div>

      {React.Children.map(content, (child, index) => {
        if (index !== openIndex) {
          return null;
        }

        return child;
      })}
    </div>
  );
};

export default Tabs;
