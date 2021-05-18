import * as express from "express";
const foodname = express.Router();

foodname.get("/:id", (req, res) => {
  res.send("search recipe using foodname");
});

export default foodname;
