import * as dotenv from "dotenv";
import ZillowScraper from "./zillow";

dotenv.config();
const scraper = new ZillowScraper();
// scraper.scrape()
scraper.getData();