import prisma from '../config/prismaClient';
import { getTaxLookupTableA, getTaxLookupTableB } from '../data/lookupTable';
import { getIncomeTaxDeductionDetails } from '../models/IncomeTaxDeduction';
import { IncomeTaxDeductionRates } from '../types/IncomeTaxDeductionRates';
import { cache } from '../cache/cache';

type LookupTable = [number, number, number][];

// Cache for lookup tables
const tableCache = {
    lookupTableA: null as LookupTable | null,
    lookupTableB: null as LookupTable | null,
};

export const getDeductions = async (): Promise<IncomeTaxDeductionRates> => {
    if (cache.incomeTaxDeduction) {
        return cache.incomeTaxDeduction;
    }

    const deductions = await getIncomeTaxDeductionDetails();
    cache.incomeTaxDeduction = deductions;

    return deductions;
};

const getLookupTableA = async (): Promise<LookupTable> => {
    if (!tableCache.lookupTableA) {
        tableCache.lookupTableA = await getTaxLookupTableA();
    }
    return tableCache.lookupTableA;
};

const getLookupTableB = async (): Promise<LookupTable> => {
    if (!tableCache.lookupTableB) {
        tableCache.lookupTableB = await getTaxLookupTableB();
    }
    return tableCache.lookupTableB;
};

const getPersonalInfo = async (employeeId: number) => {
    const personalInfo = await prisma.personalInfo.findUnique({
        where: { id: employeeId },
        select: { spouseDeduction: true, dependentDeduction: true },
    });

    if (!personalInfo) {
        throw new Error(`PersonalInfo not found for employeeId ${employeeId}`);
    }

    return personalInfo;
};

const roundToNearestTen = (value: number): number => Math.round(value / 10) * 10;

const vlookup = (value: number, table: LookupTable, colIndex: number): number => {
    for (let i = table.length - 1; i >= 0; i--) {
        if (value >= table[i][0]) {
            return table[i][colIndex - 1];
        }
    }
    return 0;
};

const calculateTaxUsingLookup = (taxableIncome: number, lookupTable: LookupTable): number => {
    const taxRate = vlookup(taxableIncome, lookupTable, 2);
    const fixedAmount = vlookup(taxableIncome, lookupTable, 3);
    return Math.ceil(taxableIncome * taxRate + fixedAmount);
};

const calculateTotalDeductions = (spouseMultiplier: number, dependentMultiplier: number, deductions: IncomeTaxDeductionRates): number => {
    return (spouseMultiplier * deductions.spouseDeduction)
        + (dependentMultiplier * deductions.dependentDeduction)
        + deductions.basicDeduction;
};


const calculateAdjustedTaxableIncome = async (
    income: number,
    spouseDeduction: number,
    dependentDeduction: number,
    deductions: IncomeTaxDeductionRates
): Promise<number> => {
    const lookupTableA = await getLookupTableA();
    const taxUsingLookup = calculateTaxUsingLookup(income, lookupTableA);
    const totalDeductions = calculateTotalDeductions(spouseDeduction, dependentDeduction, deductions);
    const finalTaxableIncome = income - taxUsingLookup - totalDeductions;
    return Math.max(finalTaxableIncome, 0);
};

const calculateTax = (taxableIncome: number, lookupTable: LookupTable): number => {
    const taxRate = vlookup(taxableIncome, lookupTable, 2);
    const fixedAmount = vlookup(taxableIncome, lookupTable, 3);
    const tax = taxableIncome * taxRate - fixedAmount;
    return roundToNearestTen(tax);
};

export const calculateIncomeTax = async (taxableIncome: number, employeeId: number): Promise<number> => {
    const { spouseDeduction, dependentDeduction } = await getPersonalInfo(employeeId);
    const deductions = await getDeductions();

    const adjustedIncome = await calculateAdjustedTaxableIncome(taxableIncome, spouseDeduction, dependentDeduction, deductions);
    const lookupTableB = await getLookupTableB();

    const incomeTax = calculateTax(adjustedIncome, lookupTableB);
    return incomeTax;
};