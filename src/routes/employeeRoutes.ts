import { Router } from 'express';
import {
    createEmployeeHandler,
    getAllEmployeesHandler,
    updateEmployeeHandler,
    getEmployeeByIdHandler,
    deleteEmployeeHandler,
    getEmployeeNamesAndIdsHandler,
    softDeleteEmployeeHandler
} from '../controllers/employeeController';

const router = Router();

router.post('/save', createEmployeeHandler);
router.get('/', getAllEmployeesHandler);
router.get('/employee-names-ids', getEmployeeNamesAndIdsHandler);
router.get('/:id', getEmployeeByIdHandler);
router.put('/:id', updateEmployeeHandler);
router.delete('/:id', deleteEmployeeHandler);
router.delete('/soft-delete/:id', softDeleteEmployeeHandler);

export default router;