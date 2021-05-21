import * as express from "express";
import { getRepository, Like } from "typeorm";
import { FoodInfo } from "../../entity/FoodInfo";
const foodname = express.Router();

foodname.get("/:foodname", (req, res) => {
  getRepository(FoodInfo)
    .createQueryBuilder("f")
    .select([
      "f.id AS food_id",
      "f.foodName AS food_name",
      "f.img_url AS food_img",
      "f.level AS level",
      "f.cooking_time AS cooking_time",
    ])
    .where({ foodName: Like(`%${req.params.foodname}%`) })
    .execute()
    .then((rst) => {
      res.status(200).json({ data: { recipe: rst }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default foodname;
