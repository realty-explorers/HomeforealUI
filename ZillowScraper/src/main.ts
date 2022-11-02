import * as dotenv from "dotenv";
import ZillowScraper from "./Zillow";

dotenv.config();
const zillowEngine = new ZillowScraper();
zillowEngine.getDeals();