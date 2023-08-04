import classNames from 'classnames';

interface FormContainerProps {
  children: React.ReactNode;
  className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  className,
}) => <div className={classNames(['px-2 lg:px-14', className])}>{children}</div>;

export default FormContainer;
