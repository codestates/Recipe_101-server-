import * as express from "express";
import { getRepository } from "typeorm";
import { Comment } from "../../entity/Comment";
import { FoodInfo } from "../../entity/FoodInfo";
import { User } from "../../entity/User";
import token from "../token";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("get comment");
});
router.get("/food/:name", (req, res) => {
  getRepository(FoodInfo)
    .findOne({
      relations: ["comment", "comment.user"],
      where: { foodName: req.params.name },
    })
    .then((rst) => {
      let data = rst.comment.map((x) => {
        let userName = x.user.userName,
          { id, comment, score } = x;
        return { id, userName, comment, score };
      });

      res.status(200).json({ data, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.get("/user/:name", (req, res) => {
  getRepository(User)
    .findOne({
      relations: ["comment", "comment.foodInfo"],
      where: { userName: req.params.name },
    })
    .then((rst) => {
      let data = rst.comment.map((x) => {
        let foodName = x.foodInfo.foodName,
          { id, comment, score } = x;
        return { id, foodName, comment, score };
      });

      res.status(200).json({ data, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.post("/", token, (req, res) => {
  getRepository(User)
    .findOne(req.body.userName)
    .then((user) => {
      return getRepository(FoodInfo)
        .findOne(req.body.id)
        .then((foodInfo) => {
          return getRepository(Comment).insert({
            user: user,
            foodInfo: foodInfo,
            comment: req.body.comment,
            score: req.body.score,
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
router.patch("/:id", token, (req, res) => {
  getRepository(Comment)
    .update(req.params.id, { ...req.body })
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});
router.delete("/:id", token, (req, res) => {
  getRepository(Comment)
    .delete(req.params.id)
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });

  res.send("delete comment");
});

export default router;
