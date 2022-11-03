import * as dotenv from "dotenv";
import Engine from "./Engine";

dotenv.config();
const engine = new Engine();
// engine.getDeals();
engine.scrape();