import { Router } from 'express';

import validate from '../../middlewares/validate';
import * as BillValidation from '../../validations/bill.validation';
import * as BillController from '../../controllers/bill.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/create', auth(), validate(BillValidation.create), BillController.createBill);
router.get('/get', auth(), BillController.getBill);

export default router;
