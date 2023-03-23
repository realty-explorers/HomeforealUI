interface ZillowQuery {
    pagination: { currentPage: number };
    usersSearchTerm: string;
    mapBounds: MapBounds
    regionSelection: { regionId: number; regionType: number }[];
    isMapVisible: boolean;
    filterState: ZillowFilter
    isListVisible: boolean;
    mapZoom: number;
}

interface MapBounds {
    west: number;
    east: number;
    south: number;
    north: number;
}

interface ZillowFilter {
    doz: { value: string };
    sortSelection: { value: string };
    isAllHomes: { value: boolean };
    isCondo: { value: boolean };
    isMultiFamily: { value: boolean };
    isManufactured: { value: boolean };
    isLotLand: { value: boolean };
    isTownhouse: { value: boolean };
    isApartment: { value: boolean };
    isApartmentOrCondo: { value: boolean };
    isRecentlySold: { value: boolean };
    isForSaleByAgent: { value: boolean };
    isForSaleByOwner: { value: boolean };
    isNewConstruction: { value: boolean };
    isComingSoon: { value: boolean };
    isAuction: { value: boolean };
    isForSaleForeclosure: { value: boolean };
    price: { min: number; max: number };
    monthlyPayment: { min: number; max: number }
}

export { ZillowQuery, ZillowFilter, MapBounds };