require("dotenv").config();
import "reflect-metadata";
import { createConnection } from "typeorm";

import { User } from "./entity/User";

createConnection()
  .then(async (connection) => {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username: "admin",
          password:
            "CpEkTHtABNMilbOe9wBozmkGVqhS7+olANvCnZSH5ekVEWcPD/nIqOvnOVIw+u34nmNcwEm31MVM9eYGrI/lpg==",
          password2:
            "+fWX+RzVf+NPE1wLE8nyDCgV1nzS28lwyBapt5Dvx6JUmSpiyeZjoR0U1H+3XhurKJ66FMJn1uQSoN5zLK39tw==",
          email: "recipe@seeker.recipe101",
          phone: "000-0000-0000",
          userimage: "",
        },
        {
          username: "public_data_portal",
          password:
            "CpEkTHtABNMilbOe9wBozmkGVqhS7+olANvCnZSH5ekVEWcPD/nIqOvnOVIw+u34nmNcwEm31MVM9eYGrI/lpg==",
          password2:
            "+fWX+RzVf+NPE1wLE8nyDCgV1nzS28lwyBapt5Dvx6JUmSpiyeZjoR0U1H+3XhurKJ66FMJn1uQSoN5zLK39tw==",
          email: "recipe@seeker.recipe101",
          phone: "000-0000-0000",
          userimage: "",
        },
      ])
      .execute();

    await connection.close();
  })
  .catch();
