/**
 * Formats Days On Market (DOM) into English text representation
 * @param compsAverageDOM - Number of days as a whole number
 * @returns Formatted string in English according to business rules
 * @example
 * formatDaysOnMarket(31);   // "1 months"
 * formatDaysOnMarket(44);   // "1.5 months"
 * formatDaysOnMarket(59);   // "2 months"
 * formatDaysOnMarket(74);   // "2.5 months"
 * formatDaysOnMarket(365);  // "1 years"
 * formatDaysOnMarket(400);  // "1 years and 1 months"
 * formatDaysOnMarket(550);  // "1 years and 6 months"
 * formatDaysOnMarket(730);  // "2 years"
 */
export function formatDaysOnMarket(compsAverageDOM: number): string {
  const DAYS_PER_MONTH = 30.4375;  // Average days per month
  const DAYS_PER_YEAR = 365.25;    // Average days per year
  
  // Rule 1: 1-30 days
  if (compsAverageDOM <= 30) {
    return `${compsAverageDOM} days`;
  }
  
  // Rule 2: 31 days to less than a year
  if (compsAverageDOM < 365) {
    const monthsRaw = compsAverageDOM / DAYS_PER_MONTH;
    const monthsRounded = Math.round(monthsRaw * 2) / 2;
    
    // Display as integer if whole number, otherwise show 0.5
    if (monthsRounded === Math.floor(monthsRounded)) {
      return `${Math.floor(monthsRounded)} months`;
    } else {
      return `${monthsRounded} months`;
    }
  }
  
  // Rule 3: A year and above (365+)
  const yearsRaw = compsAverageDOM / DAYS_PER_YEAR;
  let yearsInt = Math.floor(yearsRaw);
  const remainingDays = compsAverageDOM - (yearsInt * DAYS_PER_YEAR);
  const monthsRaw = remainingDays / DAYS_PER_MONTH;
  let monthsRounded = Math.round(monthsRaw * 2) / 2;
  
  // Normalization: prevent weird results
  if (monthsRounded >= 12) {
    yearsInt += 1;
    monthsRounded = 0;
  }
  
  // Display years only or years with months
  if (monthsRounded === 0) {
    return `${yearsInt} years`;
  } else {
    // Display months as integer if whole, otherwise with 0.5
    const monthsDisplay = monthsRounded === Math.floor(monthsRounded) 
      ? Math.floor(monthsRounded) 
      : monthsRounded;
    return `${yearsInt} years and ${monthsDisplay} months`;
  }
}
