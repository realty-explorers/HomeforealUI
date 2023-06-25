import Property from "../../../models/property";
import DataFetcher from "../../DataFetcher";


export default class RealtorAddressScraper {

    constructor() {
    }

    public getAddressData = async (address: string, dataFetcher: DataFetcher) => {
        const addressId = await this.getAddressId(address, dataFetcher);
        const url = `https://www.realtor.com/api/v1/ldp?property_id=${addressId}&status=FOR_SALE`
        const requestParameters = {
            method: 'GET',
            url: url,
        }
        const addressData = await dataFetcher.tryFetch(requestParameters, this.validateAddressData);
        const property = await this.parseAddressData(addressData);
        return property;
    }

    private validateAddressData = (data: any) => {
        try {
            const parsedData: any = data['data']['home'];
            return parsedData !== undefined;
        } catch (error) {
            // throw Error('No data found');
        }
        return false;
    }


    private getAddressId = async (address: string, dataFetcher: DataFetcher) => {
        const url = `https://parser-external.geo.moveaws.com/suggest?input=${address}&client_id=rdc-home&limit=1&area_types=address`;
        const requestParameters = {
            method: 'GET',
            url: url,
        }
        const infoResponse = await dataFetcher.tryFetch(requestParameters, this.validateAddressInfo);
        const addressId = infoResponse['autocomplete'][0]['mpr_id'];
        return addressId;

    }

    private validateAddressInfo = (data: any) => {
        try {
            const parsedData: any = data['autocomplete'];
            return parsedData !== undefined;
        } catch (error) {
            // throw Error('No data found');
        }
        return false;
    }

    private parseAddressData = async (data: any) => {
        const property = data['data']['home'];
        const nullParameters = await this.fillNullableParameters(property);
        const propertyData: Property = {
            id: '1',
            forSale: property.status === 'for_sale',
            primaryImage: property?.photos[0]?.href ?? '',
            price: property['list_price'],
            address: property['location']['address']['line'],
            street: property['location']['address']['line'],
            neighborhood: nullParameters.neighborhood,
            city: property['location']['address']['city'],
            state: property['location']['address']['state_code'],
            zipCode: +property['location']['address']['postal_code'],
            type: property['description']['type'],
            beds: nullParameters.beds,
            baths: nullParameters.baths,
            area: property['description']['sqft'],
            latitude: nullParameters.latitude,
            longitude: nullParameters.longitude,
            listingDate: property['list_date'],
        }
        return propertyData;
    }


    private fillNullableParameters = async (propertyResult: any) => {
        const parameters: any = {
            primaryPhoto: propertyResult.photos[0]?.href ?? '',
            street: null,
            beds: propertyResult.description.beds ?? 0,
            baths: propertyResult.description.baths ?? 0,
            latitude: propertyResult['location']['address']['coordinate']['lat'] ?? 0,
            longitude: propertyResult['location']['address']['coordinate']['lon'] ?? 0,
        }
        if (!propertyResult.primary_photo?.href) {
            parameters.primaryPhoto = ''
        } else {
            //TODO: handle errors with length and substring
            const photoUrl = propertyResult.photos[0]?.href;
            parameters.primaryPhoto = photoUrl.substring(0, photoUrl.length - 4) + 'od-w480_h360_x2.webp';
        }
        if (!parameters.latitude || !parameters.longitude) {
            // const coordinates = await addressToGeolocation(`${propertyResult.location.address.line} ${propertyResult.location.address.city} ${propertyResult.location.address.state} ${propertyResult.location.address.postal_code}`);
            // parameters.latitude = coordinates.latitude;
            // parameters.longitude = coordinates.longitude;
        }
        const neighborhoodObject = propertyResult.location?.neighborhoods?.find((neighborhood: any) => neighborhood.level === 'neighborhood');
        parameters.neighborhood = neighborhoodObject?.name;
        return parameters;
    }
}