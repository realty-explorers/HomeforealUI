const dateDaysDiff = (date: string) => {
  try {
    const today = new Date();
    const dateToCompare = new Date(date);
    const diffTime = Math.abs(today.getTime() - dateToCompare.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (e) {
    console.log(e);
  }
};

const readableDateDiff = (date: string) => {
  const diffDays = dateDaysDiff(date);
  if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else if (diffDays < 365) {
    const diffMonths = Math.ceil(diffDays / 30);
    return `${diffMonths} months ago`;
  } else {
    const diffYears = Math.ceil(diffDays / 365);
    return `${diffYears} years ago`;
  }
};

export { dateDaysDiff, readableDateDiff };
