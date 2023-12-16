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
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const diffMonths = Math.ceil(diffDays / 30);
    return `${diffMonths} months`;
  } else {
    const diffYears = Math.ceil(diffDays / 365);
    return `${diffYears} years`;
  }
};
function timeSince(date: string) {
  if (!date) return ("Never");
  const currentDate = new Date();
  const dateToCompare = new Date(date);
  const timeDifference = Math.abs(
    currentDate.getTime() - dateToCompare.getTime(),
  );

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

export { dateDaysDiff, readableDateDiff, timeSince };
