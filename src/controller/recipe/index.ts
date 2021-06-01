import * as express from "express";
import { getRepository } from "typeorm";
import { FoodInfo } from "../../entity/FoodInfo";
import { Ingredients } from "../../entity/Ingredients";
import { Recipe } from "../../entity/Recipe";
import { User } from "../../entity/User";
import token from "../token";
import multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "img/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
  }),
});

const router = express.Router();

router.get("/:id", (req, res) => {
  getRepository(FoodInfo)
    .findOne({
      relations: ["igrs", "recipes", "user", "foodStore", "comment"],
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
        foodStore,
        comment,
      } = rst;
      let Ingredients = igrs.map(({ name, type, cap }) => {
        return { name, type, cap };
      });
      let Recipes = recipes.map(
        ({ cookingNo, cookingDc, stepImage, stepTip }) => {
          return { cookingNo, cookingDc, stepImage, stepTip };
        }
      );
      let init: number = 0;
      let score = comment.length
        ? comment.reduce((acc, x) => {
            return (acc += x.score);
          }, init) / comment.length
        : 0;

      let food_info = {
        id,
        userName: user.userName,
        foodName,
        summary,
        nation,
        type,
        cookingTime,
        calorie,
        qnt,
        level,
        imgUrl,
        store: foodStore.length,
        score: score,
        createdAt,
        updatedAt,
      };
      res
        .status(200)
        .json({
          data: { food_info, Ingredients, Recipes, Comment: comment },
          message: "ok",
        });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.post(
  "/",
  token,
  upload.fields([{ name: "foodImage", maxCount: 1 }, { name: "stepImages" }]),
  (req, res) => {
    getRepository(User)
      .findOne({ where: { id: res.locals.id } })
      .then((rst) => {
        return getRepository(FoodInfo).insert({
          imgUrl: req.files ? req.files["foodImage"][0].filename : "",
          user: rst,
          ...JSON.parse(req.body.Food_info),
        });
      })
      .then((rst) => {
        return getRepository(FoodInfo).findOne({
          where: { id: rst.identifiers[0].id },
        });
      })
      .then((rst) => {
        let igrss = JSON.parse(req.body.Ingredients).map((x) => {
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
        let recipess = JSON.parse(req.body.Recipe).map((x, i) => {
          let stepImage = "";
          if (req.files) {
            stepImage = req.files["stepImages"]
              ? req.files["stepImages"][i].filename
              : "";
          }
          return { ...x, foodInfo: rst.foodInfo, stepImage };
        });
        return getRepository(Recipe).insert(recipess);
      })
      .then((rst) => {
        res.status(200).json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send("fail");
      });
  }
);
router.patch(
  "/:id",
  token,
  upload.fields([{ name: "foodImage", maxCount: 1 }, { name: "stepImages" }]),
  (req, res) => {
    let food_info = {};
    try {
      food_info = {
        ...JSON.parse(req.body.Food_info),
        imgUrl: req.files["foodImage"][0].filename,
      };
    } catch {
      food_info = { ...JSON.parse(req.body.Food_info) };
    }
    let Recipes = JSON.parse(req.body.Recipe).map((x, i) => {
      try {
        return { ...x, stepIamge: req.files["stepImage"][i].filename };
      } catch {
        return x;
      }
    });

    getRepository(FoodInfo)
      .update(req.params.id, { ...food_info })
      .then((rst) => {
        return getRepository(Recipe).delete({
          foodInfo: { id: Number(req.params.id) },
        });
      })
      .then((rst) => {
        return getRepository(Ingredients).delete({
          foodInfo: { id: Number(req.params.id) },
        });
      })
      .then((rst) => {
        return getRepository(FoodInfo).findOne(req.params.id);
      })
      .then((rst) => {
        let recipess = Recipes.map((x, i) => {
          return { ...x, foodInfo: rst };
        });
        return getRepository(Recipe).insert(recipess);
      })
      .then((rst) => {
        return getRepository(FoodInfo).findOne(req.params.id);
      })
      .then((rst) => {
        let igrss = JSON.parse(req.body.Ingredients).map((x) => {
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
  }
);
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
