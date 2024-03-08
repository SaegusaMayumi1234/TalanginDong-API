import { Router } from 'express';

import validate from '../../middlewares/validate';
import * as TextractValidation from '../../validations/textract.validation';
import * as TextractController from '../../controllers/textract.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/scan', auth(), validate(TextractValidation.scan), TextractController.scan);

export default router;
