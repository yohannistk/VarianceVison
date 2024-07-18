import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bg?: 'primary' | 'seconday';
}
const Button: React.FC<Props> = ({ children, size, bg, ...restProps }) => {
  return (
    <button
      className={`${
        bg == 'primary' ? 'bg-blue-500' : 'bg-yellow-500'
      } border-none outline-none px-4 text-white inline-block py-2  transition-colors rounded font-medium `}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
