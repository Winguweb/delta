// import { Icon } from '@prisma/client';
import classNames from 'classnames';
import Link from 'next/link';
import { Button } from '../molecules/Buttons/Button';
import Text from '../molecules/Text';
import { usePaginator } from '../../hooks/usePaginator';

export interface CarouselItemProps {
  id?: string;
  title: string;
  description: string;
  // icon: Icon;
}

interface CarouselProps {
  items: CarouselItemProps[];
}

const CarouselCard: React.FC<CarouselItemProps> = ({
  title,
  // icon,
  description,
}) => {
  return (
    <div className="rounded-2xl p-6 bg-box-background w-full flex flex-col space-y-3">
      <div className="space-y-1">
        <Text as="h5">{title}</Text>

        <div className="flex space-x-1 items-start justify-between">
          <Text
            as="p1"
            className="overflow-y-hidden"
            style={{
              lineClamp: 3,
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
              width: `calc(100% - 64px)`,
            }}
          >
            {description}
          </Text>
          {/* <Icon size="xl" icon={[icon]} /> */}
        </div>
      </div>

      <div className="max-w-fit">
        <Link href="/noticias">
          <Button variant="secondary">Más info</Button>
        </Link>
      </div>
    </div>
  );
};

interface ItemsProps {
  items: CarouselItemProps[];
}

const Items: React.FC<ItemsProps> = ({ items }) => {
  return (
    <div className="w-full flex space-x-10">
      {items.map((item) => {
        return (
          <div
            key={item.id ?? item.title}
            className={classNames({
              'w-1/2': items.length === 2,
            })}
          >
            <CarouselCard {...item} />
          </div>
        );
      })}
    </div>
  );
};

interface PaginatorProps {
  current: number;
  pagesList: number[];
  onChange: (pageNumber: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  onChange,
  pagesList,
  current,
}) => {
  if (pagesList.length <= 1) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      {pagesList.map((pageNumber) => {
        return (
          <button
            key={`page-${pageNumber}`}
            className={`p-1 mr-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-primary rounded-3xl ${
              pageNumber == current && 'bg-primary'
            }`}
            onClick={() => onChange(pageNumber)}
          ></button>
        );
      })}
    </div>
  );
};

const Carousel: React.FC<CarouselProps> = ({ items: carouselItems }) => {
  const desktopPaginator = usePaginator(carouselItems, 2);
  const mobilePaginator = usePaginator(carouselItems, 1);

  const baseCarouselContainerClassName = 'flex flex-col space-y-9';

  return (
    <>
      <div
        className="w-full mx-auto"
        style={{ scrollSnapType: ' x mandatory' }}
      >
        <div
          className={classNames([
            baseCarouselContainerClassName,
            'hidden lg:block',
          ])}
        >
          <Items items={desktopPaginator.items} />

          <Paginator
            current={desktopPaginator.pageNumber}
            pagesList={desktopPaginator.pagesList}
            onChange={desktopPaginator.setPageNumber}
          />
        </div>

        <div
          className={classNames([baseCarouselContainerClassName, 'lg:hidden'])}
        >
          <Items items={mobilePaginator.items} />

          <Paginator
            current={mobilePaginator.pageNumber}
            pagesList={mobilePaginator.pagesList}
            onChange={mobilePaginator.setPageNumber}
          />
        </div>
      </div>
    </>
  );
};

export default Carousel;
