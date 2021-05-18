import * as express from "express";
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
