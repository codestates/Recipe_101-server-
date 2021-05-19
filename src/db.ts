require("dotenv").config();
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { FoodInfo } from "./entity/FoodInfo";
import { Ingredients } from "./entity/Ingredients";
import { Recipe } from "./entity/Recipe";

const APIKEY = process.env.APIKEY;
createConnection()
  .then(async (connection) => {
    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: 2 },
    });
    console.log(user);

    await connection.close();
  })
  .catch();
