import * as express from "express";
import { getRepository } from "typeorm";
import { Ff } from "../../entity/Ff";
import { User } from "../../entity/User";

const router = express.Router();

router.get("/:name", (req, res) => {
  getRepository(User)
    .findOne({
      relations: [
        "follow",
        "follow.target",
        "follow.target.follower",
        "follow.target.foodInfo",
      ],
      where: { userName: req.params.name },
    })
    .then((rst) => {
      let follow = rst.follow.map((x) => {
        return {
          id: x.id,
          userName: x.target.userName,
          follower: x.target.follower.length,
          recipes: x.target.foodInfo.length,
          createdAt: x.createdAt,
        };
      });
      res.status(200).json({
        follow,
        meassge: "ok",
      });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.get("/:name/:name", (req, res) => {
  getRepository(User)
    .findOne({
      relations: [
        "follow",
        "follow.target",
        "follow.target.follower",
        "follow.target.foodInfo",
      ],
      where: { userName: req.params.name, follow: {} },
    })
    .then((rst) => {
      let follow = rst.follow.map((x) => {
        return {
          id: x.id,
          userName: x.target.userName,
          follower: x.target.follower.length,
          recipes: x.target.foodInfo.length,
          createdAt: x.createdAt,
        };
      });
      res.status(200).json({
        follow,
        meassge: "ok",
      });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.post("/", (req, res) => {
  getRepository(User)
    .find({
      where: [
        { userName: res.locals.username },
        { userName: req.body.username },
      ],
    })
    .then((rst) => {
      let user = rst[0],
        target = rst[1];
      if (user.userName === req.body.username) {
        [target, user] = [user, target];
      }
      return getRepository(Ff).insert({ user: user, target: target });
    })
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.delete("/:id", (req, res) => {
  getRepository(Ff)
    .delete(req.params.id)
    .then((rst) => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default router;
