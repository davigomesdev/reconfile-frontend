import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/utils/cn.util';

interface AvatarComponent
  extends React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>> {
  Image: typeof Image;
  Fallback: typeof Fallback;
}

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const Image = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
Image.displayName = AvatarPrimitive.Image.displayName;

const Fallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-100 text-neutral-500',
      className,
    )}
    {...props}
  />
));
Fallback.displayName = AvatarPrimitive.Fallback.displayName;

(Avatar as AvatarComponent).Image = Image;
(Avatar as AvatarComponent).Fallback = Fallback;

export default Avatar as AvatarComponent;
