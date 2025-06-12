import React from 'react';
import { cn } from '@/utils/cn.util';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('animate-pulse rounded-md bg-neutral-600', className)} {...props} />
));
Skeleton.displayName = 'Skeleton';

export default Skeleton;
