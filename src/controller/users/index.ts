import * as express from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
const router = express.Router();

router.get("/", (req, res) => {
  getRepository(User)
    .findOne({
      select: [
        "username",
        "email",
        "phone",
        "userimage",
        "createdAt",
        "updatedAt",
      ],
      where: { id: res.locals.id, username: res.locals.username },
    })
    .then((rst) => {
      res.status(200).json({
        data: {
          userinfo: { ...rst },
        },
        meassge: "ok",
      });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.patch("/", (req, res) => {
  getRepository(User)
    .update(res.locals.id, { ...req.body })
    .then((rst) => {
      res.status(200).json({ message: "information updated" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.delete("/", (req, res) => {
  getRepository(User)
    .update(res.locals.id, {
      username: "deleted username",
      password: "",
      password2: "",
      email: "",
      phone: "",
      userimage: "",
    })
    .then((rst) => {
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "He (or She)'s gone" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

export default router;
