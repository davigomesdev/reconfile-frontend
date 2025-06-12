import React from 'react';

import { PageUrlEnum } from '@/core/enums/page-url.enum';

import { signout } from '@/services/api/auth/auth.service';

import { truncateInitials } from '@/utils/format.util';

import { useAuth } from '@/hooks/use-auth';
import { Link, useNavigate } from 'react-router-dom';

import { LogOut } from 'lucide-react';

import Avatar from '../common/avatar';
import Separator from '../common/separator';
import Typography from '../common/typography';
import DropdownMenu from '../common/dropdown-menu';

const Header: React.FC = () => {
  const { isError, auth } = useAuth();

  const navigate = useNavigate();

  const handleOnClickSignOut = (): void => {
    signout();
    navigate(PageUrlEnum.SINGIN);
  };

  React.useEffect(() => {
    if (isError) {
      navigate(PageUrlEnum.SINGIN);
    }
  }, [isError]);

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-neutral-200 bg-white px-2 py-3">
      <Typography.H4>Reconfile Fornecedores</Typography.H4>
      {auth ? (
        <div className="hidden h-full items-center gap-4 md:flex">
          <Separator orientation="vertical" />
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Avatar className="cursor-pointer">
                <Avatar.Fallback>{truncateInitials(auth!.name)}</Avatar.Fallback>
              </Avatar>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="mr-1 w-56">
              <DropdownMenu.Label>
                <Typography.P className="capitalize">{auth!.name}</Typography.P>
                <Typography.P className="font-normal text-neutral-500">{auth!.email}</Typography.P>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Group className="p-1">
                <Link to={PageUrlEnum.PROFILE}>
                  <DropdownMenu.Item className="cursor-pointer">Configurações</DropdownMenu.Item>
                </Link>
              </DropdownMenu.Group>
              <DropdownMenu.Separator />
              <DropdownMenu.Group className="p-1">
                <DropdownMenu.Item className="cursor-pointer" onClick={handleOnClickSignOut}>
                  Sair
                  <DropdownMenu.Shortcut>
                    <LogOut size={18} strokeWidth={1} />
                  </DropdownMenu.Shortcut>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
