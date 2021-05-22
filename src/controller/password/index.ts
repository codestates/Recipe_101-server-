import * as express from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import * as crypto from "crypto";
const router = express.Router();

router.post("/", (req, res) => {
  getRepository(User)
    .findOne({ where: { id: res.locals.id, username: res.locals.username } })
    .then((rst) => {
      crypto.pbkdf2(
        req.body.password,
        rst.password2,
        121234,
        64,
        "sha512",
        (err, key) => {
          console.log(rst.password2);
          console.log(rst.password, key.toString("base64"));
          if (rst.password === key.toString("base64")) {
            res.status(200).json({ message: "ok" });
          } else {
            res.status(400).send("fail");
          }
        }
      );
    })
    .catch((err) => {
      res.status(400).send("fail");
    });
});

router.patch("/", (req, res) => {
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(
      req.body.password,
      buf.toString("base64"),
      121234,
      64,
      "sha512",
      (err, key) => {
        getRepository(User)
          .update(res.locals.id, {
            password: key.toString("base64"),
            password2: buf.toString("base64"),
          })
          .then((rst) => {
            res.status(200).json({
              message: "ok",
            });
          })
          .catch((err) => {
            res.status(400).send("fail");
          });
      }
    );
  });
});

export default router;
