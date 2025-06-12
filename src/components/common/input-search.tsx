import React from 'react';

import type { InputProps } from './input';

import { cn } from '@/utils/cn.util';

import { useLocation, useNavigate } from 'react-router-dom';

import { Search } from 'lucide-react';

import Input from './input';

const InputSearch = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const searchParams = new URLSearchParams(location.search);
      const searchString = event.currentTarget.value;

      if (searchString) {
        searchParams.set('filter', searchString);
        searchParams.delete('page');
      } else {
        searchParams.delete('filter');
      }

      navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    return (
      <div className="relative flex items-center justify-start">
        <Input ref={ref} {...props} className={cn('pl-9', className)} onChange={handleOnChange} />
        <span className="absolute left-2 text-neutral-600">
          <Search />
        </span>
      </div>
    );
  },
);

export default InputSearch;
