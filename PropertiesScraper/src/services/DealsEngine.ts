import BuyBox from "../models/buybox";
import CompsProperty from "../models/comps_property";
import Deal from "../models/deal";
import Property from "../models/property";

export default class DealsEngine {

    constructor() {

    }

    public findDeals = async (soldProperties: Property[], forSaleProperties: Property[], buyBox: BuyBox) => {
        const deals: Deal[] = [];
        for (const forSaleProperty of forSaleProperties) {
            const isValidForSaleProperty = this.isValidForSaleProperty(forSaleProperty, buyBox);
            if (!isValidForSaleProperty) continue;
            const houseAreaPrice = forSaleProperty.price / forSaleProperty.area;
            const relevantSoldHouses = [];
            const trueARVHouses = [];
            for (const soldProperty of soldProperties) {
                const validTrueARV = this.isValidTrueARV(soldProperty, forSaleProperty, buyBox);
                const validSoldProperty = this.isValidSoldProperty(soldProperty, forSaleProperty, buyBox);
                if (validTrueARV) trueARVHouses.push(soldProperty);
                if (validSoldProperty) relevantSoldHouses.push(soldProperty);
            }
            const averagePriceAreaRatio = relevantSoldHouses.reduce((acc, curr) => acc + curr.price / curr.area, 0) / relevantSoldHouses.length;
            const profit = 100 * (averagePriceAreaRatio - houseAreaPrice) / averagePriceAreaRatio;
            if (profit >= buyBox.underComps) {
                trueARVHouses.sort((a, b) => a.price / a.area - b.price / b.area);
                const index = Math.floor(trueARVHouses.length * 0.7);
                const relevantHouses = trueARVHouses.slice(index);
                const sum = relevantHouses.reduce((acc, curr) => acc + curr.price / curr.area, 0);
                const averageSqftPrice = sum / relevantHouses.length;
                const trueArv = 100 * (averageSqftPrice - houseAreaPrice) / averageSqftPrice;
                const estimatedArv = forSaleProperty.price / (100 - trueArv) * 100;

                console.log(forSaleProperty.price)
                deals.push({
                    profit,
                    trueArv,
                    estimatedArv: estimatedArv,
                    distance: buyBox.compsMaxDistance,
                    property: forSaleProperty,
                    relevantSoldHouses
                })
            }
        }
        return deals;
    }

    private isValidForSaleProperty = (forSaleProperty: Property, buyBox: BuyBox) => {
        const validPropertyType = buyBox.propertyType == undefined ? true : forSaleProperty.type === buyBox.propertyType;
        const validMinPrice = buyBox.minPrice == undefined ? true : forSaleProperty.price >= buyBox.minPrice;
        const validMaxPrice = buyBox.maxPrice == undefined ? true : forSaleProperty.price <= buyBox.maxPrice;
        const validMinArea = buyBox.forSaleMinArea == undefined ? true : forSaleProperty.area >= buyBox.forSaleMinArea;
        const validMaxArea = buyBox.forSaleMaxArea == undefined ? true : forSaleProperty.area <= buyBox.forSaleMaxArea;
        const validProperty = validPropertyType && validMinPrice && validMaxPrice && validMinArea && validMaxArea;
        return validProperty;
    }

    private isValidTrueARV = (soldProperty: Property, forSaleProperty: Property, buyBox: BuyBox) => {
        const validMinArea = buyBox.soldMinArea == undefined ? true : soldProperty.area >= forSaleProperty.area * 0.9;
        const validMaxArea = buyBox.soldMaxArea == undefined ? true : soldProperty.area <= forSaleProperty.area * 1.1;
        const distance = this.getDistance(forSaleProperty.latitude, soldProperty.latitude, forSaleProperty.longitude, soldProperty.longitude);
        const validDistance = buyBox.compsMaxDistance == undefined ? true : distance <= buyBox.compsMaxDistance;
        const validProperty = validMinArea && validMaxArea && validDistance;
        return validProperty;
    }

    private isValidSoldProperty = (soldProperty: Property, forSaleProperty: Property, buyBox: BuyBox) => {
        const validSoldPropertyType = buyBox.propertyType == undefined ? true : soldProperty.type === buyBox.propertyType;
        const validMinSoldPrice = buyBox.minArv == undefined ? true : soldProperty.price >= buyBox.minArv;
        const validMaxSoldPrice = buyBox.maxArv == undefined ? true : soldProperty.price <= buyBox.maxArv;
        const validHouseAge = this.validatePropertyAge(soldProperty.listingDate, buyBox.onSoldDays!);
        const validSoldMinArea = buyBox.soldMinArea == undefined ? true : soldProperty.area >= buyBox.soldMinArea;
        const validSoldMaxArea = buyBox.soldMaxArea == undefined ? true : soldProperty.area <= buyBox.soldMaxArea;
        const validMinBeds = buyBox.minBeds == undefined ? true : soldProperty.beds >= buyBox.minBeds;
        const validMaxBeds = buyBox.maxBeds == undefined ? true : soldProperty.beds <= buyBox.maxBeds;
        const validMinBaths = buyBox.minBaths == undefined ? true : soldProperty.baths >= buyBox.minBaths;
        const validMaxBaths = buyBox.maxBaths == undefined ? true : soldProperty.baths <= buyBox.maxBaths;
        const distance = this.getDistance(forSaleProperty.latitude, soldProperty.latitude, forSaleProperty.longitude, soldProperty.longitude);
        const validDistance = buyBox.compsMaxDistance == undefined ? true : distance <= buyBox.compsMaxDistance;
        const validProperty = validSoldPropertyType && validMinSoldPrice && validMaxSoldPrice && validHouseAge && validSoldMinArea && validSoldMaxArea && validMinBeds && validMaxBeds && validMinBaths && validMaxBaths && validDistance;
        return validProperty;
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