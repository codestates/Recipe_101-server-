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
import { sign } from "jsonwebtoken";
import token from "./token";
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

router.get("/signout", token, (req, res) => {
  res.clearCookie("refreshToken");
  res.send("signout");
});
router.post("/signup", (req, res) => {
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(
      req.body.password,
      buf.toString("base64"),
      121234,
      64,
      "sha512",
      (err, key) => {
        getRepository(User)
          .insert({
            userName: req.body.username,
            password: key.toString("base64"),
            password2: buf.toString("base64"),
            email: req.body.email,
            phone: req.body.phone,
            userImage: req.body.userimage ? req.body.userimage : "",
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

router.get("/refresh", (req, res) => {});

export default router;
