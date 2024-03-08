import { Router } from 'express';

import AuthRoute from './auth.route';

const router = Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
