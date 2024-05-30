import { Router } from 'express';

import validate from '../../middlewares/validate';
import * as FriendValidation from '../../validations/friend.validation';
import * as FriendController from '../../controllers/friend.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/list', auth(), FriendController.list);
router.get('/search', auth(), validate(FriendValidation.search), FriendController.search);
router.post('/request', auth(), validate(FriendValidation.request), FriendController.request);

export default router;
