import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import controller from "./controller/index";

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: [
          "http://localhost:3000",
          process.env.CLIENT_HOST,
          process.env.CLIENT_HOST2,
        ],
        credentials: true,
        exposedHeaders: "*",
      })
    );
    app.use("/", controller);

    app.listen(process.env.APP_PORT, () => {
      console.log("server running");
    });
  })
  .catch((error) => console.log(error));
