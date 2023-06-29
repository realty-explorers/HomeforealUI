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
            const relevantSoldProperties: CompsProperty[] = [];
            const trueARVProperties: CompsProperty[] = [];
            for (const soldProperty of soldProperties) {
                const distance = this.getDistance(forSaleProperty.latitude, soldProperty.latitude, forSaleProperty.longitude, soldProperty.longitude);
                const validTrueARV = this.isValidTrueARV(soldProperty, forSaleProperty, buyBox, distance);
                const validSoldProperty = this.isValidSoldProperty(soldProperty, forSaleProperty, buyBox, distance);
                const compsProperty = { ...soldProperty, distance };
                if (validTrueARV) trueARVProperties.push(compsProperty);
                if (validSoldProperty) relevantSoldProperties.push(compsProperty);
            }
            const averagePriceAreaRatio = relevantSoldProperties.reduce((acc, curr) => acc + curr.price / curr.area, 0) / relevantSoldProperties.length;
            const profit = 100 * (averagePriceAreaRatio - houseAreaPrice) / averagePriceAreaRatio;
            if (profit >= buyBox.underComps) {
                trueARVProperties.sort((a, b) => a.price / a.area - b.price / b.area);
                const index = Math.floor(trueARVProperties.length * 0.7);
                const relevantTrueARVProperties = trueARVProperties.slice(index);
                const sum = relevantTrueARVProperties.reduce((acc, curr) => acc + curr.price / curr.area, 0);
                const averageSqftPrice = sum / relevantTrueARVProperties.length;
                const trueArv = 100 * (averageSqftPrice - houseAreaPrice) / averageSqftPrice;
                const estimatedArv = forSaleProperty.price / (100 - trueArv) * 100;
                deals.push({
                    profit,
                    trueArv,
                    estimatedArv: estimatedArv,
                    distance: buyBox.compsMaxDistance,
                    property: forSaleProperty,
                    soldProperties: relevantSoldProperties,
                    trueArvProperties: relevantTrueARVProperties
                })
            }
        }
        return deals;
    }

    private isValidForSaleProperty = (forSaleProperty: Property, buyBox: BuyBox) => {
        const validPropertyType = buyBox.propertyTypes == undefined ? true : buyBox.propertyTypes.includes(forSaleProperty.type);
        const validMinPrice = buyBox.minPrice == undefined ? true : forSaleProperty.price >= buyBox.minPrice;
        const validMaxPrice = buyBox.maxPrice == undefined ? true : forSaleProperty.price <= buyBox.maxPrice;
        const validMinArea = buyBox.forSaleMinArea == undefined ? true : forSaleProperty.area >= buyBox.forSaleMinArea;
        const validMaxArea = buyBox.forSaleMaxArea == undefined ? true : forSaleProperty.area <= buyBox.forSaleMaxArea;
        const validProperty = validPropertyType && validMinPrice && validMaxPrice && validMinArea && validMaxArea;
        return validProperty;
    }

    private isValidTrueARV = (soldProperty: Property, forSaleProperty: Property, buyBox: BuyBox, distance?: number) => {
        const validPropertyType = buyBox.propertyTypes == undefined ? true : buyBox.propertyTypes.includes(soldProperty.type);
        const validMinArea = buyBox.soldMinArea == undefined ? true : soldProperty.area >= forSaleProperty.area * 0.9;
        const validMaxArea = buyBox.soldMaxArea == undefined ? true : soldProperty.area <= forSaleProperty.area * 1.1;
        const validDistance = distance == undefined ? true : distance <= buyBox.compsMaxDistance;
        const validProperty = validPropertyType && validMinArea && validMaxArea && validDistance;
        return validProperty;
    }

    private isValidSoldProperty = (soldProperty: Property, forSaleProperty: Property, buyBox: BuyBox, distance?: number) => {
        const validSoldPropertyType = buyBox.propertyTypes == undefined ? true : buyBox.propertyTypes.includes(soldProperty.type);
        const validMinSoldPrice = buyBox.minArv == undefined ? true : soldProperty.price >= buyBox.minArv;
        const validMaxSoldPrice = buyBox.maxArv == undefined ? true : soldProperty.price <= buyBox.maxArv;
        const validHouseAge = this.validatePropertyAge(soldProperty.listingDate, buyBox.onSoldDays!);
        const validSoldMinArea = buyBox.soldMinArea == undefined ? true : soldProperty.area >= buyBox.soldMinArea;
        const validSoldMaxArea = buyBox.soldMaxArea == undefined ? true : soldProperty.area <= buyBox.soldMaxArea;
        const validMinBeds = buyBox.minBeds == undefined ? true : soldProperty.beds >= buyBox.minBeds;
        const validMaxBeds = buyBox.maxBeds == undefined ? true : soldProperty.beds <= buyBox.maxBeds;
        const validMinBaths = buyBox.minBaths == undefined ? true : soldProperty.baths >= buyBox.minBaths;
        const validMaxBaths = buyBox.maxBaths == undefined ? true : soldProperty.baths <= buyBox.maxBaths;
        const validDistance = distance == undefined ? true : distance <= buyBox.compsMaxDistance;
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