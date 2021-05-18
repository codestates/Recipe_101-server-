import * as express from "express";
const itemname = express.Router();

itemname.get("/:id", (req, res) => {
  res.send("search recipe using itemname");
});

export default itemname;
