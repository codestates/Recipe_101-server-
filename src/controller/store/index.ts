import * as express from "express";
import { getRepository } from "typeorm";
import { Store } from "../../entity/Store";
import { FoodInfo } from "../../entity/FoodInfo";
import { User } from "../../entity/User";

const router = express.Router();

router.get("/", (req, res) => {
  getRepository(Store)
    .find({
      relations: ["user", "foodInfo"],
      where: { user: { id: res.locals.id } },
    })
    .then((rst) => {
      let fdata = rst.map((x) => {
        let { id, foodName, imgUrl, level, cookingTime } = x.foodInfo;
        return { id, foodName, imgUrl, level, cookingTime };
      });
      res.status(200).json({ data: [...fdata], message: "ok" });
    })
    .catch((err) => {
      res.status(200).send("ok");
    });
});

router.post("/", (req, res) => {
  getRepository(User)
    .findOne(res.locals.id)
    .then((user) => {
      return getRepository(FoodInfo)
        .findOne(req.body.id)
        .then((foodInfo) => {
          return getRepository(Store).insert({
            user: user,
            foodInfo: foodInfo,
          });
        });
    })
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.delete("/:id", (req, res) => {
  getRepository(User)
    .findOne(res.locals.id)
    .then((user) => {
      return getRepository(FoodInfo)
        .findOne(Number(req.params.id))
        .then((foodInfo) => {
          return getRepository(Store).delete({
            user: user,
            foodInfo: foodInfo,
          });
        });
    })
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default router;
