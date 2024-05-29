import { Router } from 'express';

// import validate from '../../middlewares/validate';
// import * as FriendValidation from '../../validations/auth.validation';
import * as FriendController from '../../controllers/friend.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/list', auth(), FriendController.list);

export default router;
