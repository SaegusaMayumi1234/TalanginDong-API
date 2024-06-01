import { Router } from 'express';

import validate from '../../middlewares/validate';
import * as FriendValidation from '../../validations/friend.validation';
import * as FriendController from '../../controllers/friend.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/list', auth(), FriendController.list);
router.get('/search', auth(), validate(FriendValidation.search), FriendController.search);
router.post('/request', auth(), validate(FriendValidation.request), FriendController.request);
router.delete('/cancel', auth(), validate(FriendValidation.cancel), FriendController.cancel);
router.get('/pending', auth(), FriendController.pending);
router.put('/accept', auth(), validate(FriendValidation.accept), FriendController.accept);
router.delete('/reject', auth(), validate(FriendValidation.reject), FriendController.reject);
router.delete('/remove', auth(), validate(FriendValidation.remove), FriendController.remove);

export default router;
