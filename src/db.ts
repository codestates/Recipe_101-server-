import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as axios from "axios";
import { User } from "./entity/User";
import { FoodInfo } from "./entity/FoodInfo";
import { Ingredients } from "./entity/Ingredients";
import { Recipe } from "./entity/Recipe";
import * as fs from "fs";

createConnection()
  .then(async (connection) => {
    const userRepository = connection.getRepository(User);
    const foodRepo = connection.getRepository(FoodInfo);
    const recipeRepo = connection.getRepository(Recipe);
    const igrsRepo = connection.getRepository(Ingredients);
    const user = await userRepository.findOne({
      where: { id: 2 },
    });
    let dummy = fs.readFileSync("./src/data/foodinfo.dat", "utf8");
    const Food_info = JSON.parse(dummy);
    dummy = fs.readFileSync("./src/data/recipes.dat", "utf8");
    const Recipes = JSON.parse(dummy);
    dummy = fs.readFileSync("./src/data/items.dat", "utf8");
    const Items = JSON.parse(dummy);
    let db = {};
    for (let i = 0; i < Food_info.length; i++) {
      let {
        RECIPE_ID,
        RECIPE_NM_KO,
        SUMRY,
        NATION_NM,
        TY_NM,
        COOKING_TIME,
        CALORIE,
        QNT,
        LEVEL_NM,
        IRDNT_CODE,
        PC_NM,
        IMG_URL,
      } = Food_info[i];
      db[RECIPE_ID] = i;
      await foodRepo.insert({
        user: user,
        foodName: RECIPE_NM_KO,
        summary: SUMRY,
        nation: NATION_NM,
        type: TY_NM,
        cookingTime: COOKING_TIME,
        calorie: CALORIE,
        qnt: QNT,
        level: LEVEL_NM,
        irdntCode: IRDNT_CODE,
        price: PC_NM,
        imgUrl: IMG_URL,
      });
    }
    const Foods = await foodRepo.find();

    for (let { RECIPE_ID, IRDNT_NM, IRDNT_CPCTY, IRDNT_TY_NM } of Items) {
      if (db[RECIPE_ID] !== undefined) {
        await igrsRepo.insert({
          foodInfo: Foods[db[RECIPE_ID]],
          name: IRDNT_NM,
          type: IRDNT_TY_NM,
          cap: IRDNT_CPCTY,
        });
      }
    }
    for (let {
      RECIPE_ID,
      COOKING_NO,
      COOKING_DC,
      STRE_STEP_IMAGE_URL,
      STEP_TIP,
    } of Recipes) {
      if (db[RECIPE_ID] !== undefined) {
        await recipeRepo.insert({
          foodInfo: Foods[db[RECIPE_ID]],
          cookingNo: COOKING_NO,
          cookingDc: COOKING_DC,
          stepImage: STRE_STEP_IMAGE_URL,
          stepTip: STEP_TIP,
        });
      }
    }
    console.log("end");
    connection.close();
  })
  .catch();
