import React, { HtmlHTMLAttributes } from 'react';
import { SVGProps } from 'react';

// SVGElement props
type TSVGElementProps = SVGProps<SVGSVGElement>;

interface Props extends HtmlHTMLAttributes<HTMLButtonElement> {
  svg: TSVGElementProps;
}

const IconButton: React.FC<Props> = ({ svg, ...restProps }) => {
  return (
    <button
      {...restProps}
      className="p-2 rounded-full inline-block cursor-pointer hover:bg-gray-200 transition-colors border-none outline-none"
    >
      {svg}
    </button>
  );
};

export default IconButton;
