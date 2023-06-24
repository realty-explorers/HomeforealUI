import BuyBox from "./buybox";
import Location from "./location/location_suggestion";

interface PropertySearchCriteria {
    location: Location;
    buyBox: BuyBox;
}

export default PropertySearchCriteria;