import { Router } from 'express';
import { fetchSocialInsuranceCalculationDetailsHandler, addSocialInsuranceCalculationHandler, updateSocialInsuranceCalculationHandler } from '../controllers/socialInsuranceCalculationController';

const router = Router();    

router.get('/:socialInsuranceCalculationId', fetchSocialInsuranceCalculationDetailsHandler);
router.post('/', addSocialInsuranceCalculationHandler);
router.put('/:socialInsuranceCalculationId', updateSocialInsuranceCalculationHandler);

export default router;
