interface RegionInfo {
    "regionState": {
        "regionInfo": RegionSelection[];
        "regionBounds": {
            "north": number;
            "east": number;
            "south": number;
            "west": number;
        };
    },
}

interface RegionSelection {
    "regionType": number;
    "regionId": number;
    "regionName": string;
    "displayName": string;
    "isPointRegion": boolean;
}
export { RegionInfo, RegionSelection };