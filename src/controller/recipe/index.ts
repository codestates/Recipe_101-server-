import * as express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("recipe info get");
});

router.post("/", (req, res) => {
  res.send("new recipe");
});
router.patch("/", (req, res) => {
  res.send("update recipe");
});
router.delete("/", (req, res) => {
  res.send("delete recipe");
});

export default router;
