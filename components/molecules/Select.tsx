import classNames from 'classnames';
import { keys } from 'lodash';
import React, { useState } from 'react';
type Props = {
  placeholder?: string;
  className?: string;
  items: { [key: string]: string };
  onSelect: (event: { currentTarget: { value: string; name: string } }) => void;
} & Omit<React.HTMLProps<HTMLSelectElement>, 'onSelect'>;
const Select: React.FC<Props> = (props) => {
  const {
    className,
    onSelect: handleSelect,
    value,
    placeholder,
    name,
    items,
  } = props;
  const [selectedValue, setSelectedValue] = useState(value || placeholder);
  const handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { currentTarget } = event;
    setSelectedValue(currentTarget.value);
    const key = keys(items).find((key) => items[key] === currentTarget.value);
    handleSelect &&
      handleSelect({
        currentTarget: {
          value: key!,
          name: name!,
        },
      });
  };

  return (
    <select
      name={name}
      className={classNames(
        className,
        'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'
      )}
      onChange={handleChange}
    >
      <option hidden selected value="">
        {placeholder}
      </option>
      {keys(items).map((key) => {
        return (
          <option key={key} value={items[key]} selected={key == selectedValue}>
            {items[key]}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
