import {  EmployeeCategory, EmployeeSubcategory } from '@prisma/client';
import { Response } from 'express'; 

export const validateEnumValue = <T extends object>(
  enumObj: T,
  value: string,
  res: Response,
  fieldName: string
): T[keyof T] | null => {
  const enumValue = enumObj[value.toUpperCase() as keyof typeof enumObj];

  if (!enumValue) {
    res.status(400).json({ message: `Invalid ${fieldName}: ${value}` });
    return null;
  }

  return enumValue;
};

export const validateEmployeeCategory = (employeeCategory: string, res: Response) => {
  return validateEnumValue(EmployeeCategory, employeeCategory, res, 'employee category');
};

export const validateEmployeeSubcategory = (employeeSubcategory: string, res: Response) => {
  return validateEnumValue(EmployeeSubcategory, employeeSubcategory, res, 'employee subcategory');
};