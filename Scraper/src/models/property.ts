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
    beds: number;
    baths: number;
    area: number;
    latitude: number;
    longitude: number;
    listingDate: string;
}
export default Property