import "dotenv/config";
import * as express from "express";
import { sign, verify } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
const router = express.Router();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.use("/", (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;
  let accessToken =
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ").length === 2
      ? req.headers["authorization"].split(" ")[1]
      : undefined;
  console.log(accessToken, refreshToken);
  if (!refreshToken) {
    res.status(401).send("Unauthorized");
  } else {
    verify(refreshToken, REFRESH_SECRET, (err, decode) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(401).send("RefreshToken expired. please signin again ");
        } else {
          res.status(401).send("Invalid token. please signin again ");
        }
      } else {
        verify(accessToken, ACCESS_SECRET, (err, decode2) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              const accessToken = sign(
                { id: decode.id, username: decode.username },
                ACCESS_SECRET,
                {
                  expiresIn: "30m",
                }
              );
              res.status(200).json({
                data: { accessToken },
                message: "give new token",
              });
            } else {
              res.status(401).send("Invalid token. please signin again ");
            }
          } else {
            if (
              decode.id === decode2.id &&
              decode.username === decode2.username
            ) {
              getRepository(User)
                .findOne({
                  where: {
                    id: decode.id,
                    username: decode.username,
                  },
                })
                .then((rst) => {
                  res.locals = { id: decode.id, username: decode.username };
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
});

export default router;
