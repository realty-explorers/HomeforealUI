import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import * as https from "https";
import * as http from "http";
import router from "../../api";
import * as fs from "fs";

class App {
  public app: express.Application;
  private server: https.Server | http.Server | undefined;

  constructor(
    app: express.Application,
  ) {
    this.app = app;
    this.initializeMiddlewares();
    this.app.use(
      "/api/v1/",
      router(),
    );
  }

  public startServer(port: string) {
    let status = "";
    if (process.env.__DEV__) {
      this.server = http.createServer(this.app);
      status = "development";
    } else {
      const privateKey = fs.readFileSync(
        process.env.CERTIFICATE_KEY_PATH!,
        "utf8",
      );
      const certificate = fs.readFileSync(
        process.env.CERTIFICATE_CERT_PATH!,
        "utf8",
      );
      const credentials = { key: privateKey, cert: certificate, port };
      this.server = https.createServer(credentials, this.app);
      status = "production";
    }
    this.server.listen(port, () => {
      console.log(`App listening on the port ${port} in ${status}`);
    });
  }

  public stopServer() {
    if (this.server) this.server.close();
  }

  public getServer() {
    return this.server;
  }

  private initializeMiddlewares() {
    this.app.use(
      cors(
        {
          origin: "*",
          // origin: [
          //   `https://${process.env.HOST}`,
          //   "https://localhost",
          //   "https://localhost:3000",
          //   "http://localhost:3000",
          //   "http://localhost:",
          //   "http://18.188.195.163:3000",
          //   "http://18.188.195.163",
          //   "http://20.42.85.234:3000",
          //   "http://20.42.85.234",
          //   "https://app.homeforeal.com/",
          // ],
          credentials: true,
        },
      ),
    );
    this.app.get("/", (req, res) => {
      res.send("ok");
    });
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json({ limit: "500mb" }));
    this.app.use(cookieparser());
  }
}
export default App;
