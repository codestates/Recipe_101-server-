import * as express from "express";
import { getRepository } from "typeorm";
import { Ingredients } from "../../entity/Ingredients";
import { FoodInfo } from "../../entity/FoodInfo";
const itemname = express.Router();

itemname.get("/:itemname", (req, res) => {
  let q = getRepository(FoodInfo)
    .createQueryBuilder("f")
    .innerJoinAndSelect(Ingredients, "i")
    .where("f.id = i.foodInfoId ")
    .andWhere(`i.name = :name `, { name: req.params.itemname })
    .select([
      "f.id AS food_id",
      "f.foodName AS food_name",
      "f.img_url AS food_img",
      "f.level AS level",
      "f.cooking_time AS cooking_time",
    ])
    .orderBy("f.foodName")
    .execute()
    .then((rst) => {
      res.status(200).json({ data: { recipe: rst }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default itemname;
