import fs from 'fs';

export default class Utils {

    public static sleep = async (ms: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    };

    public static saveData = (allItems: any, fileName: string) => {
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

}
