import * as express from "express";
const username = express.Router();

username.get("/:id", (req, res) => {
  res.send("search recipe using username");
});

export default username;
