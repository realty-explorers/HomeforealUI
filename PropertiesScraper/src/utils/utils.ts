import fs from 'fs';

const calcDaysDifferenceToISO = (maxAge: number) => {
	const daysToMilliseconds = 24 * 60 * 60 * 1000;
	const difference = Date.now() - maxAge * daysToMilliseconds;
	const ISODate = (new Date(difference)).toISOString();
	console.log(ISODate);
	return ISODate;
}

const sleep = async (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};


const saveData = (allItems: any, fileName: string) => {
	fs.writeFile(`raw_data/${fileName}.json`, JSON.stringify(allItems) + "\n\n", function (err) {
		if (err) return console.log(err);
	});
	// allItems.forEach(async ad => {
	//     var x = await client.index({
	//         index: 'ads',
	//         id: ad.id,
	//         body: ad.body
	//     });
	//     console.log(x);
	// });
}

export { sleep, saveData, calcDaysDifferenceToISO };
