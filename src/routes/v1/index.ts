import { Router } from 'express';

import AuthRoute from './auth.route';
import Textract from './textract.route';

const router = Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/textract',
    route: Textract,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
