interface Location {
    display: string;
    areaType: string;
    addressLine?: string;
    street?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode?: number;
}
export default Location;