import { Router } from 'express';

import * as ProfileController from '../../controllers/profile.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/get-profile', auth(), ProfileController.getProfile);

export default router;
