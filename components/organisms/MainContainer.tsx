import classNames from 'classnames';
import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
  heightStyle?: string;
  bg?: string;
}>;

const MainContainer = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, className, bg, heightStyle, ...rest } = props;

  return (
    <main
      ref={ref}
      style={{ height: `${heightStyle}` }}
      className={classNames(
        'px-content rounded-t-3xl lg:rounded-3xl flex-grow shadow-main',
        bg ? bg : 'bg-white',
        className
      )}
      {...rest}
    >
      {children}
    </main>
  );
});
export default MainContainer;
