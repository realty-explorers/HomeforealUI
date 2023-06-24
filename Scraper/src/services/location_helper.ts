
import axios from 'axios'

const PROVIDER_URL = 'https://geocoder.ca/?geoit=XML&json=1';

const addressToGeolocation = async (address: string) => {
    const url = `${PROVIDER_URL}&locate=${address}`;
    const response = await axios.get(url, { timeout: 3000 });
    const coordinates = {
        latitude: response.data.latt,
        longitude: response.data.longt
    }
    return coordinates;
}

export { addressToGeolocation }