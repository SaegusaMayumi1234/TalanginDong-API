import { Router } from 'express';

import validate from '../../middlewares/validate';
import * as AuthValidation from '../../validations/auth.validation';
import * as AuthController from '../../controllers/auth.controller';

const router = Router();

router.post('/register', validate(AuthValidation.register), AuthController.register);
router.post('/login', validate(AuthValidation.login), AuthController.login);

export default router;
