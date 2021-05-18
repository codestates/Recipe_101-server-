import * as express from "express";
import foodname from "./foodname";
import username from "./username";
import itemname from "./itemname";

const router = express.Router();

router.use("/username", username);
router.use("/foodname", foodname);
router.use("/itemname", itemname);

export default router;
