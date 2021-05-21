import * as express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("userinfo get");
});

router.patch("/", (req, res) => {
  res.send("update user info");
});
router.delete("/", (req, res) => {
  res.send("user delete");
});

export default router;
