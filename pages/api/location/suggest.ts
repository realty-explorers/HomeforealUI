import type { NextApiRequest, NextApiResponse } from 'next/'
import { getLocationSuggestions } from "@/api/location_api";
import { AxiosError } from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const searchTerm = req.query['searchTerm'] as string;
        const response = await getLocationSuggestions(searchTerm);
        res.json(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send(error);
    }
}

export default handler;
