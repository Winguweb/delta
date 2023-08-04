import { BeakerIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../molecules/Icon';
import Text from '../../molecules/Text';

type FilterItemCardProps = {
  name: string;
  description?: string;
};

const FilterItemCard: React.FC<FilterItemCardProps> = ({
  name,
  description,
}) => {
  return (
    <div className="flex flex-col text-center space-y-6">
      <div className="shadow-3xl rounded-lg w-full p-3 flex justify-center align-middle space-x-1 border border-primary">
        <Icon
          size={'small'}
          icon={<BeakerIcon />}
          className={'text-primary'}
        />
        <div className="flex flex-col space-y-1">

          <Text as="button-lg" className="font-bold">
            {name}
          </Text>
          {/* {description ?? <Text as="p1">{description}</Text>} */}
        </div>
      </div>
    </div>
  );
};

export default FilterItemCard;
