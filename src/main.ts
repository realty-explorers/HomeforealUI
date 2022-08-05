import * as dotenv from "dotenv";
import ZillowScraper from "./zillow";
import Yad2Scraper from "./zillow";

dotenv.config();
const scraper = new ZillowScraper();
scraper.extract()