import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import controller from "./controller/index";
const app = express();
app.use(bodyParser.json());

app.use("/", controller);

app.listen(3000);
