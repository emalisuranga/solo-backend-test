export interface AdjustLeaveRequestParams {
    employeeId: number;
    newTotalDays: number;
    salaryMonth: number;
    salaryYear: number;
}

export interface LeaveRequests {
    id?: number;
    employeeId: number;
    initialDays: number;
    adjustedDays: number;
    totalDays: number;
    requestDate?: Date;
    createdAt?: Date;
    salaryMonth: number;
    salaryYear: number;
}

export interface PaidHolidays {
    id: number;
    employeeId: number;
    totalLeave: number;
    usedLeave: number;
    remainingLeave: number;
    leaveStart: Date;
    leaveEnd: Date;
    lastUpdated: Date;
    isValid: boolean;
}