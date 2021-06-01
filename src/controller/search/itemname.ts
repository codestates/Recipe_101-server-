import * as express from "express";
import { getRepository, Like } from "typeorm";
import { Ingredients } from "../../entity/Ingredients";
import { FoodInfo } from "../../entity/FoodInfo";
const itemname = express.Router();

itemname.get("/:itemname", (req, res) => {
  let items = req.params.itemname.split("&");

  let q = getRepository(FoodInfo).createQueryBuilder("f");
  items.forEach((x: string, i: number) => {
    let sub = {};
    sub[`name${i + 1}`] = `%${x}%`;
    q = q
      .innerJoinAndSelect(
        Ingredients,
        `igrs${i + 1}`,
        `f.id = igrs${i + 1}.foodInfoId`
      )
      .andWhere(`igrs${i + 1}.name like :name${i + 1}`, sub);
  });

  q.select([
    "f.id AS food_id",
    "f.foodName AS food_name",
    "f.imgUrl AS food_img",
    "f.level AS level",
    "f.cookingTime AS cooking_time",
  ])
    .groupBy("f.id")
    .execute()
    .then((rst) => {
      res.status(200).json({ data: { recipe: rst }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default itemname;
