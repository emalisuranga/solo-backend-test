import { Router } from 'express';
import { getReports, addReport } from '../controllers/reportController';

const router = Router();

router.get('/', getReports);
router.post('/', addReport);

export default router;