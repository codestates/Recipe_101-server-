import * as express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.send("password check");
});
router.patch("/", (req, res) => {
  res.send("password update");
});

export default router;
