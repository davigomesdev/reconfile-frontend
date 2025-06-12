import React from 'react';

import { NAV_MENU_ITEMS } from '@/constants/nav-menu-items';

import { cn } from '@/utils/cn.util';

import { Link, useLocation } from 'react-router-dom';

import Typography from '../common/typography';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 flex h-[40px] w-full items-center justify-between border-b border-neutral-200 bg-white">
      <ul className="flex h-full">
        {NAV_MENU_ITEMS.map((item, index) => {
          return <NavMenu key={index} {...item} />;
        })}
      </ul>
    </nav>
  );
};

interface NavMenuProps {
  title: string;
  path: string;
  target?: React.HTMLAttributeAnchorTarget;
}

const NavMenu: React.FC<NavMenuProps> = ({ title, path, target }) => {
  const location = useLocation();
  const isActive =
    location.pathname === path || (location.pathname.startsWith(path) && path !== '/');

  return (
    <li
      className={cn(
        'flex h-full items-center justify-center px-2',
        isActive && 'border-b-2 border-neutral-900',
      )}
    >
      <Link target={target} to={path}>
        <Typography.P className={cn('text-sm', isActive && 'font-normal')}>{title}</Typography.P>
      </Link>
    </li>
  );
};

export default Navbar;
