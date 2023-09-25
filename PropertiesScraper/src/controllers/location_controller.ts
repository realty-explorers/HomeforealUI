import { NextFunction, Request, Response, Router } from "express";
import { ParsedQs } from "qs";
import LocationService from "../services/location_service";

type QueryType = string | string[] | ParsedQs | ParsedQs[] | undefined;

export default class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  public getSuggestions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const searchTerm = req.query["searchTerm"] as string;
      const response = await this.locationService.getLocationSuggestions(
        searchTerm,
      );
      res.json(response);
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };

  public getLocationData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const type = req.query["type"] as string;
      const city = req.query["city"] as string;
      const state = req.query["state"] as string;
      const neighborhood = req.query["neighborhood"] as string;
      const response = await this.locationService.getLocationData(
        type,
        state,
        city,
        neighborhood,
      );
      res.json(response);
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  };
}
