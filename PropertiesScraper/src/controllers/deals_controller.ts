import { NextFunction, Request, Response, Router } from "express";
import DealsService from "../services/deals_service";
import { ParsedQs } from "qs";
import { RequestWithUser } from "../auth/auth_middleware";
import { PropertyStatus } from "../models/region_filter";

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class DealsController {
  private dealsService: DealsService;

  constructor() {
    this.dealsService = new DealsService();
  }

  public findProperties = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const type = req.query["type"] as string;
      const state = req.query["state"] as string;
      const zipcode = req.query["zipcode"] as string;
      const city = req.query["city"] as string;
      const neighborhood = req.query["neighborhood"] as string;
      const daysOnMarket = parseInt(req.query["daysOnMarket"] as string);
      const propertyStatuses = [PropertyStatus.SOLD, PropertyStatus.FOR_SALE];
      // const userId = req.user!.name;
      const userId = "";
      const response = await this.dealsService.findProperties(
        userId,
        type,
        propertyStatuses,
        state,
        city,
        zipcode,
        neighborhood,
        daysOnMarket,
      );
      res.json(response);
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };

  public findDeals = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { buyBox, updatedProperty } = req.body;
      const userId = req.user!.name;
      const response = await this.dealsService.findDeals(
        userId,
        buyBox,
        updatedProperty,
      );
      res.json(response);
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };

  public findGeneralDeals = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const buyBox = {
        "compsMaxDistance": 1,
        "underComps": 0,
        "minArv": 0,
        "maxArv": 1000000,
        "minPrice": 0,
        "maxPrice": 1000000,
        "onSaleDays": 180,
        "onSoldDays": 180,
        "forSaleMinArea": 500,
        "forSaleMaxArea": 10000,
        "soldMinArea": 500,
        "soldMaxArea": 10000,
        "minBeds": 1,
        "maxBeds": 9,
        "minBaths": 1,
        "maxBaths": 9,
        // "propertyTypes": ["single_family"]
      };
      const userId = req.user!.name;
      const response = await this.dealsService.findDeals(userId, buyBox);
      res.json(response);
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };
}
