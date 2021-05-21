import * as express from "express";
import { getRepository } from "typeorm";
import { FoodInfo } from "../../entity/FoodInfo";
const router = express.Router();

router.get("/:id", (req, res) => {
  getRepository(FoodInfo)
    .findOne({
      relations: ["igrs", "recipes", "user"],
      where: { id: req.params.id },
    })
    .then((rst) => {
      let {
        id: food_id,
        foodName: food_name,
        summary,
        nation,
        type,
        cooking_time,
        calorie,
        qnt,
        level,
        img_url: food_img,
        createdAt,
        updatedAt,
        igrs,
        user,
        recipes,
      } = rst;
      let Ingredients = igrs.map(({ name, type, cap }) => {
        return { name, type, cap };
      });
      let Recipes = recipes.map(
        ({ cooking_no, cooking_dc, step_image, step_tip }) => {
          return { cooking_no, cooking_dc, step_image, step_tip };
        }
      );

      let food_info = {
        food_id,
        user_id: user.id,
        food_name,
        summary,
        nation,
        type,
        cooking_time,
        calorie,
        qnt,
        level,
        food_img,
        createdAt,
        updatedAt,
      };
      console.log({ food_info, Ingredients, Recipes });
      res
        .status(200)
        .json({ data: { food_info, Ingredients, Recipes }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.post("/", (req, res) => {
  res.send("new recipe");
});
router.patch("/", (req, res) => {
  res.send("update recipe");
});
router.delete("/", (req, res) => {
  res.send("delete recipe");
});

export default router;
