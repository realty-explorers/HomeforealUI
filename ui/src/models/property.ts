interface Property {
    id: string;
    forSale?: boolean;
    primaryImage: string,
    images?: string[]
    price: number;
    address: string;
    street: string;
    city: string;
    state: string
    zipCode: number;
    type: PropertyType;
    beds: number;
    baths: number;
    area: number;
    latitude: number;
    longitude: number;
    listingDate: string;
}

enum PropertyType {
    OTHER = 'other',
    CONDO = 'condo',
    TOWN_HOUSE = 'town_house',
    SINGLE_FAMILY = 'single_family',
    MULTI_FAMILY = 'multi_family',
    MOBILE_HOUSE = 'mobile_house',
}
export default Property
export { PropertyType };