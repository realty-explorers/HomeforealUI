import Property from "../models/property";

export default class PropertiesCache {

    private propertiesCache: { [id: string]: Property[] };

    constructor() {
        this.propertiesCache = {};
    }

    public cacheProperties = async (id: string, properties: Property[]) => {
        this.propertiesCache[id] = properties;
        console.log(Object.keys(this.propertiesCache))
    }

    public hasProperties = async (id: string) => {
        return id in this.propertiesCache;
    }

    public getProperties = async (id: string) => {
        if (!this.hasProperties(id)) throw Error('No saved properties');
        return this.propertiesCache[id];
    }

}