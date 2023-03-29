import CompsProperty from "./comps_property";
import Property from "./property";

interface Deal {
    profit: number,
    distance: number,
    property: Property,
    relevantSoldHouses: CompsProperty[];
}

export default Deal;