interface RequireMarkProps {
  marginLeft?: string;
}

const RequireMark: React.FC<RequireMarkProps> = ({ marginLeft }) => {
  return (
    <p
      style={{
        color: '#346AF0',
        margin: marginLeft
          ? `.4em .5em .5em ${marginLeft}em`
          : '.4em .5em .5em 4.2em',
        position: 'absolute',
        width: '1.2em',
      }}
    >
      *
    </p>
  );
};

export default RequireMark;
