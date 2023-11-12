import RequestParameters from "../models/request_parameters";

interface DataFetcher {
  tryFetch: (
    requestParameters: RequestParameters,
    validateData: (data: any) => boolean,
    maxTries?: number,
    metadata?: any,
  ) => Promise<any>;
}

export default DataFetcher;
