import { ThreeDots } from 'react-loader-spinner';

interface LoadingProps {
  color?: string;
  size?: number;
}
const Loading: React.FC<LoadingProps> = ({ color, size }) => {
  return (
    <ThreeDots
      height={size || 50}
      width={size || 50}
      color={color || '#346AF0'}
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="three-dots-loading"
    />
  );
};

export default Loading;
