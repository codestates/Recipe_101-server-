import "dotenv/config";
import * as express from "express";
import { sign, verify } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import axios from "axios";
const router = express.Router();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.use("/", (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;
  console.log(req.cookies);
  let accessToken =
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ").length === 2
      ? req.headers["authorization"].split(" ")[1]
      : undefined;

  if (req.cookies.iskakao) {
    if (!refreshToken) {
      res.status(401).send("Unauthorized");
    } else {
      axios
        .get("https://kapi.kakao.com/v1/user/access_token_info", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((rst) => {
          return getRepository(User).findOne({
            where: { userName: rst.data.id },
          });
        })
        .then((rst) => {
          res.locals = { id: rst.id, username: rst.userName };
          next();
        })
        .catch((err) => {
          // console.log(err);
          res.status(200).send("invalid user");
        });
    }
  } else {
    if (!refreshToken) {
      res.status(401).send("Unauthorized");
    } else {
      verify(refreshToken, REFRESH_SECRET, (err, decode: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            res.status(401).send("RefreshToken expired. please signin again ");
          } else {
            res.status(401).send("Invalid token. please signin again ");
          }
        } else {
          verify(accessToken, ACCESS_SECRET, (err, decode2: any) => {
            if (err) {
              if (err.name === "TokenExpiredError") {
                const accessToken = sign({ id: decode.id }, ACCESS_SECRET, {
                  expiresIn: "1h",
                });
                res.status(200).json({
                  data: { accessToken },
                  message: "give new token",
                });
              } else {
                res.status(401).send("Invalid token. please signin again ");
              }
            } else {
              if (decode.id === decode2.id) {
                getRepository(User)
                  .findOne({
                    where: {
                      id: decode.id,
                    },
                  })
                  .then((rst) => {
                    res.locals = { id: rst.id, username: rst.userName };
                    next();
                  })
                  .catch((err) => {
                    res.status(200).send("invalid user");
                  });
              } else {
                res.status(200).send("invalid user");
              }
            }
          });
        }
      });
    }
  }
});

export default router;
