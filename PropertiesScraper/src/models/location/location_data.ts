interface LocationData {
    center: {
        latitude: number;
        longitude: number;
    };
    breakPoints: {
        width: number;
        height: number;
        zoom?: number;
    }[];
    bounds: { latitude: number, longitude: number }[][] | { latitude: number, longitude: number }[][][];
    type: string;
    // bounds: {
    //     bound: {
    //         latitude: number;
    //         longitude: number;
    //     }[]
    // }[];
}
export default LocationData;