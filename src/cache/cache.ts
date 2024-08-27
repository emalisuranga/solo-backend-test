import { InsuranceCalculationCache } from '../types/InsuranceCalculationInterfaces';
import { IncomeTaxDeductionRates } from '../types/IncomeTaxDeductionRates';

// In-memory cache object
const cache: InsuranceCalculationCache & { incomeTaxDeduction: IncomeTaxDeductionRates | null } = {
  socialInsuranceCalculation: null,
  monthlyRemunerations: null,
  deductions: {},
  incomeTaxDeduction: null,
};

// Function to clear the cache every 15 minutes
const clearCache = () => {
  cache.deductions = {};
  cache.socialInsuranceCalculation = null;
  cache.monthlyRemunerations = null;
  cache.incomeTaxDeduction = null;
  console.log('Cache cleared');
};

// Schedule cache clearing every 15 minutes
setInterval(clearCache, 15 * 60 * 1000);

export { cache, clearCache };