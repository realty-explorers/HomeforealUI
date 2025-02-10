import CompsProperty from "./comps_property";
import Property from "./property";

interface Deal {
    profit: number,
    trueArv: number,
    estimatedArv: number,
    distance: number,
    property: Property,
    soldProperties: CompsProperty[];
    trueArvProperties: CompsProperty[];
}

export default Deal;