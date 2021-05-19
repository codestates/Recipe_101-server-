require("dotenv").config();
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as axios from "axios";
import * as fetch from "node-fetch";
import { User } from "./entity/User";
import { FoodInfo } from "./entity/FoodInfo";
import { Ingredients } from "./entity/Ingredients";
import { Recipe } from "./entity/Recipe";
import { REFUSED } from "dns";

const API_KEY = process.env.API_KEY;
createConnection()
  .then(async (connection) => {
    const userRepository = connection.getRepository(User);
    const foodRepo = connection.getRepository(FoodInfo);
    const recipeRepo = connection.getRepository(Recipe);
    const igrsRepo = connection.getRepository(Ingredients);
    // const user = await userRepository.findOne({
    //   where: { id: 2 },
    // });
    let cmd = `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000226_1/1/1000`;
    const Food_info = await axios.default
      .get(cmd)
      .then((res) => res.data)
      .then((res) => {
        return res["Grid_20150827000000000226_1"];
      })
      .then((res) => res.row)
      .catch();
    const db = {};
    Food_info.forEach(async (x, i) => {
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
      } = x;
      db[RECIPE_ID] = i;
      //   await foodRepo.insert({
      //     user: user,
      //     foodName: RECIPE_NM_KO,
      //     summary: SUMRY,
      //     nation: NATION_NM,
      //     type: TY_NM,
      //     cooking_time: COOKING_TIME,
      //     calorie: CALORIE,
      //     qnt: QNT,
      //     level: LEVEL_NM,
      //     IRDNT_code: IRDNT_CODE,
      //     price: PC_NM,
      //     img_url: IMG_URL,
      //   });

      //   let food_info = new FoodInfo();
      //   food_info.user = user;
      //   food_info.foodName = RECIPE_NM_KO;
      //   food_info.summary = SUMRY;
      //   food_info.nation = NATION_NM;
      //   food_info.type = TY_NM;
      //   food_info.cooking_time = COOKING_TIME;
      //   food_info.calorie = CALORIE;
      //   food_info.qnt = QNT;
      //   food_info.level = LEVEL_NM;
      //   food_info.IRDNT_code = IRDNT_CODE;
      //   food_info.price = PC_NM;
      //   food_info.img_url = IMG_URL;
      //   await connection.manager.save(food_info);
    });

    const foods = await foodRepo.find();
    // console.log(foods);
    // console.log(foods.length);
    // let count = await foodRepo.count();
    // console.log(`number of food_info : ${count}`);
    //    console.log(db);
    for (let i = 0; i < 7; i++) {
      let cmd2 = `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000227_1/${
        1 + i * 1000
      }/${1000 * (i + 1)}`;

      let igrs = await axios.default
        .get(cmd2)
        .then((res) => res.data)
        .then((res) => {
          return res["Grid_20150827000000000227_1"];
        })
        .then((res) => res.row)
        .catch();
      for (let { RECIPE_ID, IRDNT_NM, IRDNT_CPCTY, IRDNT_TY_NM } of igrs) {
        await igrsRepo.insert({
          foodInfo: foods[db[RECIPE_ID]],
          name: IRDNT_NM,
          type: IRDNT_TY_NM,
          cap: IRDNT_CPCTY,
        });
      }
    }

    // count = await igrsRepo.count();
    // console.log(`number of Ingredient : ${count}`);

    for (let i = 0; i < 4; i++) {
      let cmd2 = `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000228_1/${
        1 + i * 1000
      }/${1000 * (i + 1)}`;

      let recipes = await axios.default
        .get(cmd2)
        .then((res) => res.data)
        .then((res) => {
          return res["Grid_20150827000000000228_1"];
        })
        .then((res) => res.row)
        .catch();

      for (let {
        RECIPE_ID,
        COOKING_NO,
        COOKING_DC,
        STRE_STEP_IMAGE_URL,
        STEP_TIP,
      } of recipes) {
        await recipeRepo.insert({
          foodInfo: foods[db[RECIPE_ID]],
          cooking_no: COOKING_NO,
          cooking_dc: COOKING_DC,
          step_image: STRE_STEP_IMAGE_URL,
          step_tip: STEP_TIP,
        });
      }
    }
    // count = await recipeRepo.count();
    // console.log(`number of recipe : ${count}`);

    await connection.close();
  })
  .catch();
