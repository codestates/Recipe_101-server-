import * as express from "express";
import { getRepository } from "typeorm";
import { Ff } from "../../entity/Ff";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("get subscribe info");
});

router.post("/", (req, res) => {
  res.send("new subscribe");
});

router.delete("/", (req, res) => {
  res.send("no subscribe");
});

export default router;
