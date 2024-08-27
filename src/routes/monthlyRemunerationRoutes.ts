import { Router } from 'express';
import { fetchMonthlyRemunerationDetailsHandler, addMonthlyRemunerationHandler } from '../controllers/MonthlyRemunerationController';

const router = Router();

router.get('/', fetchMonthlyRemunerationDetailsHandler);
router.post('/', addMonthlyRemunerationHandler);

export default router;