import * as express from "express";
import { getRepository } from "typeorm";
import { Store } from "../../entity/Store";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("get stored recipe");
});

router.post("/", (req, res) => {
  res.send("new recipe stored");
});

router.delete("/", (req, res) => {
  res.send("good bye recipe");
});

export default router;
