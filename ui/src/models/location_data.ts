interface Location {
    center: {
        latitude: number;
        longitude: number;
    };
    breakPoints: {
        width: number;
        height: number;
        zoom?: number;
    }[];
    bounds: {
        type: string;
        coordinates: bound[] | bound[][];
    };
    type: string;
}

type bound = {
    latitude: number;
    longitude: number;
}[]
export default Location;