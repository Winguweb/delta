import React from 'react';
import Tag from '../../../../molecules/Tag';
import Select from '../../../../molecules/Input/Select';
import Text from '../../../../molecules/Text';

interface Filter {
  name: string;
  options: { value: string; label: string }[];
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
}

interface MultipleFiltersProps {
  filters: Filter[];
  onDelete: (deleted: { value: string; key: string }) => void;
}

export const MultipleFilters: React.FC<MultipleFiltersProps> = ({
  filters,
  onDelete,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 space-y-4 lg:space-y-0 items-center">
        <Text as="p2" className='hidden lg:flex'>Filtros:</Text>

        {filters.map((filter) => {
          return (
            <Select
              onChange={(value) => filter.onChange(value as string[])}
              value={filter.value}
              placeholder={filter.placeholder}
              key={filter.placeholder}
            >
              {filter.options.map((option) => {
                return (
                  <Select.Option value={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                );
              })}
            </Select>
          );
        })}
      </div>

      <div className="pl-10">
        {Object.values(filters).map((filter) => {
          const selectedFilters = filter.options
            .filter((option) => filter.value.includes(option.value))
            .map((option) => option.label);

          return selectedFilters.map((selectedFilter) => {
            return (
              <Tag
                key={`tag-${selectedFilter}`}
                label={selectedFilter}
                onClickDelete={() =>
                  onDelete({
                    key: filter.name,
                    value: filter.options.find(
                      (option) => option.label === selectedFilter
                    )?.value as string,
                  })
                }
              />
            );
          });
        })}
      </div>
    </div>
  );
};
