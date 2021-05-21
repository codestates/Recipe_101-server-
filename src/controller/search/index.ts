import * as express from "express";
import foodname from "./foodname";
import username from "./username";
import itemname from "./itemname";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ok");
});

router.use("/username", username);
router.use("/foodname", foodname);
router.use("/itemname", itemname);

export default router;
