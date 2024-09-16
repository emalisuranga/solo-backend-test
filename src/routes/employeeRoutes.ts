import { Router } from 'express';
import {
    createEmployeeHandler,
    getAllEmployeesHandler,
    updateEmployeeHandler,
    getEmployeeByIdHandler,
    deleteEmployeeHandler,
    getEmployeeNamesAndIdsHandler,
    softDeleteEmployeeHandler,
    getNextEmployeeNumberHandler
} from '../controllers/employeeController';

const router = Router();

// Specific routes should come before dynamic ones
router.get('/next-employee-number', getNextEmployeeNumberHandler);
router.get('/employee-names-ids', getEmployeeNamesAndIdsHandler);

router.post('/save', createEmployeeHandler);
router.get('/', getAllEmployeesHandler);

// Dynamic routes should be after specific ones
router.get('/:id', getEmployeeByIdHandler);
router.put('/:id', updateEmployeeHandler);
router.delete('/:id', deleteEmployeeHandler);
router.delete('/soft-delete/:id', softDeleteEmployeeHandler);

export default router;