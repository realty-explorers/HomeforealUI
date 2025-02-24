const calculateArvPercentage = (arvPrice: number, listingPrice: number) => {
  if (!arvPrice || !listingPrice || listingPrice === 0) return 0;
  const percentage = ((arvPrice - listingPrice) / arvPrice) * 100;
  return percentage;
};

const calculateMarginPercentage = (
  arvPrice: number,
  listingPrice: number,
  expenses: number
) => {
  if (!arvPrice || !listingPrice || !expenses || listingPrice === 0) return 0;
  const percentage =
    ((arvPrice - listingPrice - expenses) / listingPrice) * 100;
  return percentage;
};

export { calculateArvPercentage, calculateMarginPercentage };
