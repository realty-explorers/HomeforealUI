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
  // bounds: { latitude: number, longitude: number }[][] | { latitude: number, longitude: number }[][][];
  // bounds: [number, number][][] | [number, number][][][];
  bounds: any;

  type: string;
  // bounds: {
  //     bound: {
  //         latitude: number;
  //         longitude: number;
  //     }[]
  // }[];
}
export default Location;
