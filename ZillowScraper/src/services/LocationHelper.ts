
import axios from 'axios'
export default class LocationHelper {

    private readonly providerUrl;

    constructor() {
        // this.providerUrl = `http://api.positionstack.com/v1/forward?access_key=${process.env.GEOCODE_API_KEY}`;
        this.providerUrl = `https://geocoder.ca/?geoit=XML&json=1`;
    }

    public addressToGeolocation = async (address: string) => {
        const url = `${this.providerUrl}&locate=${address}`;
        const response = await axios.get(url);
        const coordinates = {
            latitude: response.data.latt,
            longitude: response.data.longt
        }
        return coordinates;
    }
}