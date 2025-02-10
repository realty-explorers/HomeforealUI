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
  bounds: any;
  type: string;
}

export default Location;
