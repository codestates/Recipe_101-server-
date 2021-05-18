import * as express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("get comment");
});

router.post("/", (req, res) => {
  res.send("new comment");
});
router.patch("/", (req, res) => {
  res.send("update comment");
});
router.delete("/", (req, res) => {
  res.send("delete comment");
});

export default router;
