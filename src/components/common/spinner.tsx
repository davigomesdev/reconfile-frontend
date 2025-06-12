import { cn } from '@/utils/cn.util';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

const spinnerVariants = cva('animate-spin rounded-full ease-linear', {
  variants: {
    variant: {
      white: 'border-b-transparent border-l-white border-r-white border-t-white',
      black: 'border-b-transparent border-l-blue-500 border-r-blue-500 border-t-blue-500',
    },
    size: {
      xs: 'h-[13px] w-[13px] border-2',
      sm: 'h-5 w-5 border-2',
      md: 'h-7 w-7 border-2',
      lg: 'h-10 w-10 border-[3px]',
      xg: 'h-12 w-12 border-[4px]',
    },
  },
  defaultVariants: {
    variant: 'white',
    size: 'sm',
  },
});

interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner: React.FC<SpinnerProps> = ({ className, variant, size, ...props }) => {
  return <span className={cn(spinnerVariants({ variant, size, className }))} {...props} />;
};

export default Spinner;
