import "dotenv/config";
import { getRepository } from "typeorm";
import * as express from "express";
import * as crypto from "crypto";
import users from "./user/index";
import recipe from "./recipe/index";
import search from "./search/index";
import password from "./password/index";
import comment from "./comment/index";
import store from "./store/index";
import subscribe from "./subscribe/index";
import { User } from "../entity/User";
import { FoodInfo } from "../entity/FoodInfo";
import { Store } from "../entity/Store";
import { sign } from "jsonwebtoken";
import token from "./token";
import * as fs from "fs";
import multer = require("multer");
const mime = require("mime-types");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./img/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
  }),
});
const ACCESS_SECRET: string = process.env.ACCESS_SECRET;
const REFRESH_SECRET: string = process.env.REFRESH_SECRET;
const router = express.Router();

router.use("/user", token, users);
router.use("/recipe", recipe);
router.use("/comment", comment);
router.use("/search", search);
router.use("/password", token, password);
router.use("/store", token, store);
router.use("/subscribe", token, subscribe);

router.get("/", (req, res) => {
  res.send("ok");
});

router.get("/signout", token, (req, res) => {
  res.clearCookie("refreshToken");
  res.send("signout");
});

router.get("/image/:url", (req, res) => {
  fs.readFile("./img/" + req.params.url, (err, data) => {
    if (err) {
      res.status(400).send("fail");
    } else {
      let type = mime.lookup(req.params.url);
      res.set({ "Content-Type": type });
      res.status(200).send(data);
    }
  });
});

router.get("/recent/:num", (req, res) => {
  let num = Number(req.params.num);
  getRepository(FoodInfo)
    .find({
      select: ["id", "foodName", "cookingTime", "level", "imgUrl"],
      order: { id: "DESC" },
      take: num,
    })
    .then((rst) => {
      let nrst = rst.map((x) => {
        return {
          food_id: x.id,
          food_name: x.foodName,
          food_img: x.imgUrl,
          level: x.level,
          cooking_time: x.cookingTime,
        };
      });
      res.status(200).json({ data: { recipe: nrst }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.get("/recommend/:num", (req, res) => {
  let num = Number(req.params.num);

  getRepository(FoodInfo)
    .createQueryBuilder("f")
    .leftJoinAndSelect(
      (sub) => {
        return sub
          .from(FoodInfo, "f")
          .addFrom(Store, "s")
          .where("f.id = s.foodInfoId")
          .groupBy("f.id")
          .select("f.id", "id")
          .addSelect("COUNT(s.id)", "count");
      },
      "dummy",
      "f.id= dummy.id"
    )
    .select([
      "f.id AS food_id",
      "f.foodName AS food_name",
      "f.imgUrl AS food_img",
      "f.level AS level",
      "f.cookingTime AS cooking_time",
      "count AS count",
    ])
    .orderBy("count", "DESC")
    .addOrderBy("f.foodName", "ASC")
    .limit(num)
    .execute()
    .then((rst) => {
      res.status(200).json({ data: { recipe: rst }, message: "ok" });
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.post("/signin", (req, res) => {
  getRepository(User)
    .findOne({
      where: { userName: req.body.username },
    })
    .then((rst) => {
      crypto.pbkdf2(
        req.body.password,
        rst.password2,
        121234,
        64,
        "sha512",
        (err, key) => {
          console.log(rst.password, key.toString("base64"));
          if (rst.password === key.toString("base64")) {
            const accesstoken = sign(
              { id: rst.id, username: rst.userName },
              ACCESS_SECRET,
              {
                expiresIn: "30m",
              }
            );
            const refreshtoken = sign(
              { id: rst.id, username: rst.userName },
              REFRESH_SECRET,
              {
                expiresIn: "24h",
              }
            );
            res.cookie(`refreshToken=${refreshtoken};`, "set Cookie", {
              maxAge: 24 * 6 * 60 * 10000,
              sameSite: "none",
              httpOnly: true,
              // secure: true,
            });
            res.status(200).json({
              data: {
                accessToken: accesstoken,
                userinfo: {
                  username: rst.userName,
                  email: rst.email,
                  phone: rst.phone,
                  userimage: rst.userImage,
                  createdAt: rst.createdAt,
                },
              },
              message: "ok",
            });
          } else {
            res.status(403).send("fail");
          }
        }
      );
    })
    .catch((err) => {
      res.status(403).send("fail");
    });
});

router.post("/signup", upload.single("userImage"), (req, res) => {
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(
      req.body.password,
      buf.toString("base64"),
      121234,
      64,
      "sha512",
      (err, key) => {
        let data = {
          userName: req.body.username,
          password: key.toString("base64"),
          password2: buf.toString("base64"),
          email: req.body.email,
          phone: req.body.phone,
          userImage: "",
        };
        if (req.file) {
          data["userImage"] = req.file.filename;
        }

        getRepository(User)
          .insert({
            ...data,
          })
          .then((rst) => {
            const accesstoken = sign(
              { id: rst.identifiers[0].id, username: req.body.username },
              ACCESS_SECRET,
              {
                expiresIn: "30m",
              }
            );
            const refreshtoken = sign(
              { id: rst.identifiers[0].id, username: req.body.username },
              REFRESH_SECRET,
              {
                expiresIn: "24h",
              }
            );
            res.append("Set-Cookie", `refreshToken=${refreshtoken};`);
            res.status(200).json({
              data: {
                accessToken: accesstoken,
                message: "ok",
              },
            });
          })
          .catch((err) => {
            res.status(400).send("fail");
          });
      }
    );
  });
});

router.post(
  "/dummy",
  upload.fields([
    { name: "userImage", maxCount: 1 },
    { name: "stepImage", maxCount: 5 },
  ]),
  (req, res) => {
    console.log({ ...req.body });
    //  console.log(req.body);
    if (req.files) {
      console.log(req.files);
    }
    res.send("dummy");
    // 정상적으로 완료됨
  }
);

export default router;
