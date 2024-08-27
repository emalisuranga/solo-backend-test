import { Router } from 'express';
import { addSalaryDetailsHandler, getSalaryDetailsByMonthHandler, getSalaryDetailsByPaymentIdHandler, updateSalaryDetailsHandler, deleteSalaryDetailsHandler, calculateSalaryDetailsHandler, calculateIncomeTaxHandler } from '../controllers/salaryController';

const router = Router();

router.post('/save', addSalaryDetailsHandler);
router.get('/payment/:paymentId', getSalaryDetailsByPaymentIdHandler);
router.get('/:month/:year', getSalaryDetailsByMonthHandler); 
router.put('/payment/:id', updateSalaryDetailsHandler);
router.delete('/:paymentId', deleteSalaryDetailsHandler);
router.post('/calculate-salary', calculateSalaryDetailsHandler);
router.post('/income-tax', calculateIncomeTaxHandler);

export default router;