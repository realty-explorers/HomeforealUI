import type { NextApiRequest, NextApiResponse } from 'next/'
import { findDeals } from "@/api/deals_api";
import { AxiosError } from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') throw Error('Invalid request method');
        const fields = req.body;
        const response = await findDeals(fields.regionId, fields.distance, fields.profit, fields.soldMinPrice, fields.soldMaxPrice, fields.propertyMinPrice, fields.propertyMaxPrice, fields.soldAge, fields.forSaleAge, fields.minArea, fields.maxArea, fields.minBeds, fields.maxBeds, fields.minBaths, fields.maxBaths);
        res.json(response.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send(error);
    }
}

export default handler;
