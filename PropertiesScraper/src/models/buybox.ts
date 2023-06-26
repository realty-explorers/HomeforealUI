import { PropertyType } from "./property";

interface BuyBox {
    location?: string;
    compsMaxDistance: number;
    underComps: number;
    minArv?: number;
    maxArv?: number;
    minPrice?: number;
    maxPrice?: number;
    onSaleDays?: number;
    onSoldDays?: number;
    forSaleMinArea?: number;
    forSaleMaxArea?: number;
    soldMinArea?: number;
    soldMaxArea?: number;
    minBeds?: number;
    maxBeds?: number;
    minBaths?: number;
    maxBaths?: number;
    propertyTypes?: PropertyType[];
}

export default BuyBox;