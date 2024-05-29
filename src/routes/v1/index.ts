import { Router } from 'express';

import AuthRoute from './auth.route';
import TextractRoute from './textract.route';
import FriendRoute from './friend.route';

const router = Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/textract',
    route: TextractRoute,
  },
  {
    path: '/friend',
    route: FriendRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
