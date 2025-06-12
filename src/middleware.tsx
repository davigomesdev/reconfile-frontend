import React from 'react';

import { PageUrlEnum } from './core/enums/page-url.enum';
import { getTokens, savePath } from './utils/cookie.util';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const Middleware: React.FC = () => {
  const location = useLocation();
  const [hasValidToken, setHasValidToken] = React.useState<boolean | null>(null);

  const checkRefreshToken = React.useCallback((): boolean => {
    const { refreshToken } = getTokens();
    return !!refreshToken;
  }, []);

  React.useEffect(() => {
    setHasValidToken(checkRefreshToken());

    const intervalId = setInterval(() => {
      setHasValidToken(checkRefreshToken());
    }, 5000);

    return (): void => clearInterval(intervalId);
  }, [checkRefreshToken]);

  if (hasValidToken === null) return null;

  if (!hasValidToken) {
    savePath(location.pathname + location.search);
    return <Navigate replace to={PageUrlEnum.SINGIN} />;
  }

  return <Outlet />;
};
