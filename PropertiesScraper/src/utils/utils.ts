import fs from "fs";

const calcDaysDifferenceToISO = (maxAge: number) => {
  const daysToMilliseconds = 24 * 60 * 60 * 1000;
  const difference = Date.now() - maxAge * daysToMilliseconds;
  const ISODate = new Date(difference).toISOString();
  return ISODate;
};

const convertISODates = (minDate: Date, maxDate: Date) => {
  const minDateISO = minDate.toISOString();
  const maxDateISO = maxDate.toISOString();
  return { minDateISO, maxDateISO };
};

const ISODifferenceToDays = (isoString: string) => {
  const date = new Date(isoString);
  const difference = Date.now() - date.getTime();
  const daysToMilliseconds = 24 * 60 * 60 * 1000;
  const daysDifference = difference / daysToMilliseconds;
  return daysDifference;
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const saveData = (allItems: any, fileName: string) => {
  fs.writeFile(
    `raw_data/${fileName}.json`,
    JSON.stringify(allItems) + "\n\n",
    function (err) {
      if (err) return console.log(err);
    },
  );
  // allItems.forEach(async ad => {
  //     var x = await client.index({
  //         index: 'ads',
  //         id: ad.id,
  //         body: ad.body
  //     });
  //     console.log(x);
  // });
};

const constructPropertyId = (
  address: string,
  city: string,
  state: string,
  zipCode: string,
) => {
  try {
    const id =
      `${address.toLowerCase()}-${city.toLowerCase()}-${state.toLowerCase()}-${zipCode}`;
    return id;
  } catch (err) {
    throw new Error(
      `Error constructing property id: ${err}, address: ${address}, city: ${city}, state: ${state}, zipCode: ${zipCode}`,
    );
  }
};

const constructRegionId = (city: string, state: string) => {
  const id = `${city}-${state}`;
  return id;
};

export {
  calcDaysDifferenceToISO,
  constructPropertyId,
  constructRegionId,
  ISODifferenceToDays,
  saveData,
  sleep,
};
