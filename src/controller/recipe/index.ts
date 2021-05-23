import * as express from "express";
import { getRepository } from "typeorm";
import { FoodInfo } from "../../entity/FoodInfo";
import { Ingredients } from "../../entity/Ingredients";
import { Recipe } from "../../entity/Recipe";
import { User } from "../../entity/User";
import token from "../token";
const router = express.Router();

router.get("/:id", (req, res) => {
  getRepository(FoodInfo)
    .findOne({
      relations: ["igrs", "recipes", "user"],
      where: { id: req.params.id },
    })
    .then((rst) => {
      let {
        id,
        foodName,
        summary,
        nation,
        type,
        cookingTime,
        calorie,
        qnt,
        level,
        imgUrl,
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
        ({ cookingNo, cookingDc, stepImage, stepTip }) => {
          return { cookingNo, cookingDc, stepImage, stepTip };
        }
      );

      let food_info = {
        id,
        userId: user.id,
        foodName,
        summary,
        nation,
        type,
        cookingTime,
        calorie,
        qnt,
        level,
        imgUrl,
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

router.post("/", token, (req, res) => {
  getRepository(User)
    .findOne({ where: { id: res.loacls.id } })
    .then((rst) => {
      return getRepository(FoodInfo).insert({
        imgUrl: "",
        user: rst,
        ...req.body.Food_info,
      });
    })
    .then((rst) => {
      return getRepository(FoodInfo).findOne({
        where: { id: rst.identifiers[0].id },
      });
    })
    .then((rst) => {
      let igrss = req.body.Ingredients.map((x) => {
        return { ...x, foodInfo: rst };
      });

      return getRepository(Ingredients).insert(igrss);
    })
    .then((rst) => {
      return getRepository(Ingredients).findOne({
        relations: ["foodInfo"],
        where: { id: rst.identifiers[0].id },
      });
    })
    .then((rst) => {
      let recipess = req.body.Recipe.map((x) => {
        return { ...x, foodInfo: rst.foodInfo };
      });
      return getRepository(Recipe).insert(recipess);
    })
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});
router.patch("/:id", token, (req, res) => {
  getRepository(FoodInfo)
    .update(req.params.id, { ...req.body.Food_info })
    .then((rst) => {
      return getRepository(Recipe).delete({
        foodInfo: { id: req.params.id },
      });
    })
    .then((rst) => {
      return getRepository(Ingredients).delete({
        foodInfo: { id: req.params.id },
      });
    })
    .then((rst) => {
      return getRepository(FoodInfo).findOne(req.params.id);
    })
    .then((rst) => {
      let recipess = req.body.Recipe.map((x) => {
        return { ...x, foodInfo: rst };
      });
      return getRepository(Recipe).insert(recipess);
    })
    .then((rst) => {
      return getRepository(FoodInfo).findOne(req.params.id);
    })
    .then((rst) => {
      let igrss = req.body.Ingredients.map((x) => {
        return { ...x, foodInfo: rst };
      });
      return getRepository(Ingredients).insert(igrss);
    })
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});
router.delete("/:id", token, (req, res) => {
  getRepository(FoodInfo)
    .delete(req.params.id)
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default router;
