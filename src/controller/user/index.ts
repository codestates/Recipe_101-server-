import * as express from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
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

router.get("/", (req, res) => {
  getRepository(User)
    .findOne({
      select: [
        "userName",
        "email",
        "phone",
        "userImage",
        "createdAt",
        "updatedAt",
      ],
      where: { id: res.locals.id, userName: res.locals.username },
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

router.patch("/", upload.single("userImage"), (req, res) => {
  let data = { ...req.body };
  if (req.file) {
    data["userImage"] = req.file.filename;
  }

  getRepository(User)
    .update(res.locals.id, { ...data })
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
      userName: "deleted username",
      password: "",
      password2: "",
      email: "",
      phone: "",
      userImage: "",
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
