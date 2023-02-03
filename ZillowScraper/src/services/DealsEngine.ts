import House from "../models/house";

export default class DealsEngine {

    constructor() {

    }

    private radians = (x: number) => {
        return x * Math.PI / 180;
    };

    private getDistance = (latitudeA: number, latitudeB: number, longitudeA: number, longitudeB: number) => {
        const earthRadius = 3958.756; // Earth’s mean radius in meter
        const latitudeDifference = this.radians(latitudeB - latitudeA);
        const longitudeDifference = this.radians(longitudeB - longitudeA);
        const a = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
            Math.cos(this.radians(latitudeA)) * Math.cos(this.radians(latitudeB)) *
            Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = earthRadius * c;
        return d; // returns the distance in meter
    };

    public findDeals = async (soldHouses: House[], forSaleHouses: House[], maxDistance: number, minProfit: number, propertyMinPrice?: number, propertyMaxPrice?: number) => {
        const deals: { profit: number, distance: number, house: House, relevantSoldHouses: House[] }[] = [];
        for (const forSaleHouse of forSaleHouses) {
            const validMinPrice = propertyMinPrice && forSaleHouse.price >= propertyMinPrice;
            const validMaxPrice = propertyMaxPrice && propertyMaxPrice !== 0 && forSaleHouse.price <= propertyMaxPrice;
            if (propertyMinPrice && !validMinPrice || propertyMaxPrice && !validMaxPrice) continue;

            const houseAreaPrice = forSaleHouse.price / forSaleHouse.area;
            let soldHousesPriceSum = 0
            let soldHousesCount = 0
            const relevantSoldHouses = [];
            for (const soldHouse of soldHouses) {
                const distance = this.getDistance(forSaleHouse.latitude, soldHouse.latitude, forSaleHouse.longitude, soldHouse.longitude);
                if (distance <= maxDistance) {
                    relevantSoldHouses.push(soldHouse);
                    // soldHousesPriceSum += soldHouseList[soldHouseId].hdpData.homeInfo.price;
                    soldHousesPriceSum += soldHouse.price / soldHouse.area;
                    soldHousesCount++;
                }
            }
            const soldHousesAveragePrice = soldHousesPriceSum / soldHousesCount;
            const profit = 100 * (soldHousesAveragePrice - houseAreaPrice) / soldHousesAveragePrice;
            if (profit >= minProfit) {
                deals.push({
                    profit,
                    distance: maxDistance,
                    house: forSaleHouse,
                    relevantSoldHouses
                })
            }
        }
        return deals;
    }

    // public findDeals = async (soldHouseList: { [id: string]: House }, forSaleHouseList: { [id: string]: House }, maxDistance: number, minProfit: number) => {
    //     const deals: { profit: Number, house: House, relevantSoldHouses: House[] }[] = [];
    //     for (const houseId in forSaleHouseList) {
    //         const housePrice = forSaleHouseList[houseId].hdpData.homeInfo.price;
    //         const houseArea = forSaleHouseList[houseId].area;
    //         const houseAreaPrice = housePrice / houseArea;
    //         const latitude = forSaleHouseList[houseId].latitude;
    //         const longitude = forSaleHouseList[houseId].longitude;
    //         let soldHousesPriceSum = 0
    //         let soldHousesCount = 0
    //         const relevantSoldHouses = [];
    //         for (const soldHouseId in soldHouseList) {
    //             const soldHouseLatitude = soldHouseList[soldHouseId].latitude;
    //             const soldHouseLongitude = soldHouseList[soldHouseId].longitude;
    //             const distance = this.getDistance(latitude, soldHouseLatitude, longitude, soldHouseLongitude);
    //             if (isNaN(distance)) {

    //                 console.log(`NANA: lat: ${latitude} soldLat: ${soldHouseLatitude} lon: ${longitude} soldLon: ${soldHouseLongitude}`)
    //                 console.log(JSON.stringify(forSaleHouseList[houseId]));
    //             }
    //             console.log('distance: ' + distance);
    //             if (distance <= maxDistance) {
    //                 relevantSoldHouses.push(soldHouseList[soldHouseId]);
    //                 // soldHousesPriceSum += soldHouseList[soldHouseId].hdpData.homeInfo.price;
    //                 soldHousesPriceSum += soldHouseList[soldHouseId].hdpData.homeInfo.price / soldHouseList[soldHouseId].area;
    //                 soldHousesCount++;
    //             }
    //         }
    //         const soldHousesAveragePrice = soldHousesPriceSum / soldHousesCount;
    //         const profit = 100 * (soldHousesAveragePrice - houseAreaPrice) / soldHousesAveragePrice;
    //         if (profit >= minProfit) {
    //             deals.push({
    //                 profit,
    //                 house: forSaleHouseList[houseId],
    //                 relevantSoldHouses
    //             })
    //         }
    //     }
    //     return deals;
    // }

}