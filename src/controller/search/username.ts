import * as express from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { FoodInfo } from "../../entity/FoodInfo";
const username = express.Router();

username.get("/:name", (req, res) => {
  getRepository(User)
    .createQueryBuilder("u")
    .innerJoinAndSelect(FoodInfo, "f", "u.id = f.userId")
    .select([
      "f.id AS food_id",
      "f.foodName AS food_name",
      "f.imgUrl AS food_img",
      "f.level AS level",
      "f.cookingTime AS cooking_time",
    ])
    .where({ userName: req.params.name })
    .execute()
    .then((rst) => {
      res.status(200).json({ data: { recipe: rst }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default username;
