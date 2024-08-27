import { Router } from 'express';
import { createInitialLeaveRequestHandler } from '../controllers/leaveManagementController';

const router = Router();

// Route to create an initial leave request
router.post('/create-initial-leave', createInitialLeaveRequestHandler);

// Route to adjust an existing leave request
// Assuming you have a similar handler for adjusting leave requests
// import { adjustLeaveRequestHandler } from '../controllers/leaveManagementController';
// router.put('/adjustLeaveRequest/:id', adjustLeaveRequestHandler);

export default router;