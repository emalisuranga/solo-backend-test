import { Router } from 'express';
import { fetchSalarySlipDetailHandler, updateRemarksHandler } from '../controllers/salarySlipController';

const router = Router();

router.get('/:employeeId/:paymentDetailsId', fetchSalarySlipDetailHandler);
router.put('/:paymentDetailsId', updateRemarksHandler);

export default router;