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
    bounds: bound[];
}

type bound = {
    latitude: number;
    longitude: number;
}[]
export default Location;