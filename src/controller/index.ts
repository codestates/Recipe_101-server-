import * as express from "express";
import users from "./users/index";
import recipe from "./recipe/index";
import search from "./search/index";
import password from "./password/index";
import store from "./store/index";
import subscribe from "./subscribe/index";

const router = express.Router();

router.use("/users", users);
router.use("/recipe", recipe);
router.use("/search", search);
router.use("/password", password);
router.use("/store", store);
router.use("/subscribe", subscribe);

router.get("/", (req, res) => {
  res.send("ok");
});

router.post("/signin", (req, res) => {
  res.send("signin");
});
router.get("/signout", (req, res) => {
  res.send("signout");
});
router.post("/signup", (req, res) => {
  res.send("signup");
});

export default router;
