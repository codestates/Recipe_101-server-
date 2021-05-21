import * as express from "express";
import { getRepository } from "typeorm";
import { Ingredients } from "../../entity/Ingredients";
import { FoodInfo } from "../../entity/FoodInfo";
const itemname = express.Router();

itemname.get("/:itemname", (req, res) => {
  let items = req.params.itemname.split("&");
  items = items.map((x: string, i: number) => {
    let ans = {},
      sub = {};
    sub[`name${i + 1}`] = x;
    ans["name"] = `name${i + 1}`;
    ans["alias"] = `igrs${i + 1}`;
    ans[`value`] = sub;
    return ans;
  });
  let q = getRepository(FoodInfo).createQueryBuilder("f");
  for (let { name, alias, value } of items) {
    q = q
      .innerJoinAndSelect(Ingredients, alias, `f.id = ${alias}.foodInfoId`)
      .andWhere(`${alias}.name = :${name}`, value);
  }
  q.select([
    "f.id AS food_id",
    "f.foodName AS food_name",
    "f.img_url AS food_img",
    "f.level AS level",
    "f.cooking_time AS cooking_time",
  ])
    .execute()
    .then((rst) => {
      res.status(200).json({ data: { recipe: rst }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default itemname;
