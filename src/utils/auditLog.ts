import prisma from '../config/prismaClient';

/**
 * Logs an audit event in the database.
 * 
 * @param {object} logDetails - The details of the audit log entry.
 * @param {string} logDetails.action - The action performed (e.g., 'DELETE').
 * @param {string} logDetails.entity - The entity on which the action was performed (e.g., 'SalaryDetails').
 * @param {string} logDetails.entityId - The ID of the entity (e.g., the paymentDetailsId).
 * @param {number} logDetails.performedBy - The ID of the user who performed the action.
 * @param {Date} logDetails.performedAt - The time when the action was performed.
 * @param {string} [logDetails.details] - Optional additional details about the action.
 */
export const logAudit = async ({
  action,
  entity,
  entityId,
  performedBy,
  performedAt,
  details,
}: {
  action: string;
  entity: string;
  entityId: string;
  performedBy: number;
  performedAt: Date;
  details?: string;
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        performedBy,
        performedAt,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Handle error appropriately (e.g., notify a monitoring service)
  }
};