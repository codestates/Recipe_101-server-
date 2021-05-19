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
          userName: "admin",
          password: "test",
          password2: "test",
          email: "recipe@seeker.recipe101",
          phone: "000-0000-0000",
        },
        {
          userName: "public_data_portal",
          password: "test",
          password2: "test",
          email: "recipe@seeker.recipe101",
          phone: "000-0000-0000",
        },
      ])
      .execute();

    await connection.close();
  })
  .catch();
