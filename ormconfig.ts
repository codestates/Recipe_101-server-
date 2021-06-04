import "dotenv/config";
module.exports = {
  type: process.env.DATABASE_TYPE,
  // host: process.env.DATABASE_HOST_LOCAL,
  // port: process.env.DATABASE_PORT_LOCAL,
  // username: process.env.DATABASE_USERNAME_LOCAL,
  // password: process.env.DATABASE_PASSWORD_LOCAL,
  // database: process.env.DATABASE_NAME_LOCAL,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
