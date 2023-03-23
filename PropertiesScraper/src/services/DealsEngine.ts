import CompsProperty from "../models/comps_property";
import Property from "../models/property";

export default class DealsEngine {

    constructor() {

    }

    public findDeals = async (soldProperties: Property[], forSaleProperties: Property[], maxDistance: number, minProfit: number, soldMinPrice?: number, soldMaxPrice?: number, propertyMinPrice?: number, propertyMaxPrice?: number, soldAge?: number, forSaleAge?: number, minArea?: number, maxArea?: number, minBeds?: number, maxBeds?: number, minBaths?: number, maxBaths?: number) => {
        const deals: { profit: number, distance: number, property: Property, relevantSoldHouses: CompsProperty[] }[] = [];
        for (const forSaleProperty of forSaleProperties) {
            const validMinPrice = propertyMinPrice == undefined ? true : forSaleProperty.price >= propertyMinPrice;
            const validMaxPrice = propertyMaxPrice == undefined ? true : forSaleProperty.price <= propertyMaxPrice;
            const notValidForSaleHouse = !validMinPrice || !validMaxPrice;
            if (notValidForSaleHouse) continue;
            const houseAreaPrice = forSaleProperty.price / forSaleProperty.area;
            let soldHousesPriceSum = 0
            let soldHousesCount = 0
            const relevantSoldHouses = [];
            for (const soldProperty of soldProperties) {
                const validMinSoldPrice = soldMinPrice == undefined ? true : soldProperty.price >= soldMinPrice;
                const validMaxSoldPrice = soldMaxPrice == undefined ? true : soldProperty.price <= soldMaxPrice;
                const validHouseAge = this.validatePropertyAge(soldProperty.listingDate, soldAge!);
                const validMinArea = minArea == undefined ? true : soldProperty.area >= minArea;
                const validMaxArea = maxArea == undefined ? true : soldProperty.area <= maxArea;
                const validMinBeds = minBeds == undefined ? true : soldProperty.beds >= minBeds;
                const validMaxBeds = maxBeds == undefined ? true : soldProperty.beds <= maxBeds;
                const validMinBaths = minBaths == undefined ? true : soldProperty.baths >= minBaths;
                const validMaxBaths = maxBaths == undefined ? true : soldProperty.baths <= maxBaths;

                const notValidSoldHouse = (!validMinSoldPrice || !validMaxSoldPrice || !validHouseAge || !validMinArea || !validMaxArea || !validMinBeds || !validMaxBeds || !validMinBaths || !validMaxBaths);
                if (notValidSoldHouse) continue;
                const distance = this.getDistance(forSaleProperty.latitude, soldProperty.latitude, forSaleProperty.longitude, soldProperty.longitude);
                if (distance <= maxDistance) {
                    const compsProperty = { ...soldProperty, distance };
                    relevantSoldHouses.push(compsProperty);
                    soldHousesPriceSum += soldProperty.price / soldProperty.area;
                    soldHousesCount++;
                }
            }
            const soldHousesAveragePrice = soldHousesPriceSum / soldHousesCount;
            const profit = 100 * (soldHousesAveragePrice - houseAreaPrice) / soldHousesAveragePrice;
            if (profit >= minProfit) {
                console.log(forSaleProperty.price)
                deals.push({
                    profit,
                    distance: maxDistance,
                    property: forSaleProperty,
                    relevantSoldHouses
                })
            }
        }
        return deals;
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

    private validatePropertyAge = (propertyListingDate: string, maxAge: number) => {
        const timeDifference = Date.now() - (new Date(propertyListingDate)).getTime();
        const daysToMilliseconds = 24 * 60 * 60 * 1000;
        const validAge = timeDifference <= maxAge * daysToMilliseconds;
        return validAge;
    }

}