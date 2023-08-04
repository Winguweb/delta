import Select from './Input/Select';

export interface TimePickerProps {
  hr: {
    onChange: (value: string) => void;
    value: string;
    placeholder?: string;
  };
  min: {
    onChange: (value: string) => void;
    value: string | null;
    placeholder?: string;
  };
}

const TimePicker: React.FC<TimePickerProps> = ({ hr, min }) => {
  return (
    <div className="flex flex-col lg:flex-row space-x-0 space-y-3 lg:space-y-0 lg:space-x-3 w-full">
      <Select
        onChange={(value) => {
          hr.onChange(value as string);
        }}
        placeholder={hr.placeholder}
        value={hr.value}
      >
        {Array.from({ length: 24 }, (_, i) => i).map((i) => {
          const value = i < 10 ? `0${i}` : String(i);
          const parsedHour = `${value} hs`;
          return (
            <Select.Option key={`hour-${i}`} value={value}>
              {parsedHour}
            </Select.Option>
          );
        })}
      </Select>

      <Select
        onChange={(value) => {
          min.onChange(value as string);
        }}
        placeholder={min.placeholder}
        value={min.value}
      >
        {Array.from({ length: 60 }, (_, i) => i).map((i) => {
          const value = i < 10 ? `0${i}` : String(i);
          const parsedMinute = `${value} min`;

          return (
            <Select.Option key={`minute-${i}`} value={value}>
              {parsedMinute}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

export default TimePicker;
