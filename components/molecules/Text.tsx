import classNames from 'classnames';
import React, { HTMLProps } from 'react';

interface BaseTextProps {
  // h6 is not here because is not in design system
  as?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'p1'
    | 'p2'
    | 'p3'
    | 'label'
    | 'span'
    | 'span2'
    | 'button-lg'
    | 'button-md';
}

interface TextPropsParagraph
  extends BaseTextProps,
    Omit<HTMLProps<HTMLParagraphElement>, 'as'> {
  as:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'p1'
    | 'p2'
    | 'p3'
    | 'span'
    | 'span2'
    | 'button-lg'
    | 'button-md';
}
interface TextPropsLabel
  extends BaseTextProps,
    Omit<HTMLProps<HTMLLabelElement>, 'as'> {
  as: 'label';
}

type TextProps = TextPropsParagraph | TextPropsLabel;

const Text: React.FC<TextProps> = ({ as = 'p1', ...props }) => {
  if (as === 'label') {
    return <label className="text-sm" {...(props as TextPropsLabel)} />;
  }

  const Node = {
    h1: (props: Omit<TextPropsParagraph, 'as'>) => (
      <h1
        {...props}
        className={classNames([
          props.className,
          'font-semibold text-2xl-plus lg:text-3xl-plus',
        ])}
      />
    ),
    h2: (props: Omit<TextPropsParagraph, 'as'>) => (
      <h2
        {...props}
        className={classNames([props.className, 'font-family-2 !font-bold text-2xl text-dark lg:text-black'])}
      />
    ),
    h3: (props: Omit<TextPropsParagraph, 'as'>) => (
      <h3
        {...props}
        className={classNames([props.className, 'font-family-2 font-bold text-base'])}
      />
    ),
    h4: (props: Omit<TextPropsParagraph, 'as'>) => (
      <h4
        {...props}
        className={classNames([props.className, 'font-semibold text-xl-plus'])}
      />
    ),
    h5: (props: Omit<TextPropsParagraph, 'as'>) => (
      <h5
        {...props}
        className={classNames([props.className, 'font-semibold text-lg'])}
      />
    ),
    p1: (props: Omit<TextPropsParagraph, 'as'>) => (
      <p {...props} className={classNames([props.className, 'text-base font-normal'])} />
    ),
    p2: (props: Omit<TextPropsParagraph, 'as'>) => (
      <p {...props} className={classNames([props.className, 'text-sm font-semibold'])} />
    ),
    p3: (props: Omit<TextPropsParagraph, 'as'>) => (
      <p {...props} className={classNames([props.className, 'text-xs font-medium'])} />
    ),
    span: (props: Omit<TextPropsParagraph, 'as'>) => (
      <span {...props} className={classNames([props.className, 'text-base font-normal'])} />
    ),
    span2: (props: Omit<TextPropsParagraph, 'as'>) => (
      <span {...props} className={classNames([props.className, 'text-sm font-semibold'])} />
    ),
    'button-lg': (props: Omit<TextPropsParagraph, 'as'>) => (
      <span {...props} className={classNames([props.className, 'text-lg'])} />
    ),
    'button-md': (props: Omit<TextPropsParagraph, 'as'>) => (
      <span {...props} className={classNames([props.className, 'text-sm'])} />
    ),
  }[as as TextPropsParagraph['as']];

  return <Node {...(props as TextPropsParagraph)} />;
};

export default Text;
