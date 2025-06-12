import React from 'react';

import { PageUrlEnum } from './core/enums/page-url.enum';

import { setupNavigate } from './utils/navigation.util';

import { Middleware } from './middleware';
import { BrowserRouter, Route, Routes, Outlet, useNavigate, useLocation } from 'react-router-dom';

import Layout from './app/layout';

import Home from './app/home';
import SignIn from './app/auth/signin';
import SignUp from './app/auth/signup';
import Profile from './app/profile';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  React.useEffect(() => {
    setupNavigate(navigate);
  }, [navigate]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<SignIn />} path={PageUrlEnum.DEFAULT} />
      <Route element={<SignIn />} path={PageUrlEnum.SINGIN} />
      <Route element={<SignUp />} path={PageUrlEnum.SIGNUP} />
      <Route element={<Middleware />}>
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route element={<Home />} path={PageUrlEnum.HOME} />
          <Route element={<Profile />} path={PageUrlEnum.PROFILE} />
        </Route>
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
