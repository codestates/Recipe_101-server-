import "dotenv/config";
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
          password:
            "oOGWqmhlc2UfnrG44KF837jsseC5MsYKNKSBuS5ZLdi6aH4XefUOfAfkPc1xAHpGsbRYg7YIkjU+rgQL0kOapw==",
          password2:
            "OGDaaT3YsX/O8HaRRd0E3fshvGIqUihFuY4IPNxbBWjSXSaI1kFFRFg1KGC0mc0c2EMQeyeQDF0trxctLDXsEQ==",
          email: "recipe@seeker.recipe101",
          phone: "000-0000-0000",
          userImage: "",
        },
        {
          userName: "public_data_portal",
          password:
            "oOGWqmhlc2UfnrG44KF837jsseC5MsYKNKSBuS5ZLdi6aH4XefUOfAfkPc1xAHpGsbRYg7YIkjU+rgQL0kOapw==",
          password2:
            "OGDaaT3YsX/O8HaRRd0E3fshvGIqUihFuY4IPNxbBWjSXSaI1kFFRFg1KGC0mc0c2EMQeyeQDF0trxctLDXsEQ==",
          email: "recipe@seeker.recipe101",
          phone: "000-0000-0000",
          userImage: "",
        },
      ])
      .execute();

    await connection.close();
  })
  .catch();
