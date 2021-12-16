import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import https from "https";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

const main = async () => {
  const result = dotenv.config({ path: "config.env" });
  if (result.error) {
    throw result.error;
  }
  console.log(result.parsed);

  // sendEmail("bob@bob.com", "hello there!");

  const conn = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "Richeek45",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });

  await conn.runMigrations();
  // await Post.delete({})

  const app = express();

  let RedisStore = connectRedis(session);
  let redis = new Redis();

  var allowedOrigins = [
    "http://localhost:3000",
    "https://studio.apollographql.com",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
        httpOnly: true,
        sameSite: "none", // csrf
        secure: true, // only works in https
      },
      saveUninitialized: false,
      secret: "learning",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: async ({ req, res }): Promise<MyContext> => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }), // accessible by the resolvers
  });

  // More required logic for integrating with Express
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
    // cors: {
    // origin: "http://localhost:3000",
    // credentials: true,
    // }
  });

  app.get("/", (_, res) => {
    res.send("hello!");
  });

  const options = {
    key: fs.readFileSync("localhost+1-key.pem"),
    cert: fs.readFileSync("localhost+1.pem"),
  };

  https.createServer(options, app).listen(process.env.PORT, () => {
    console.log(`server started at localhost ${process.env.PORT}!`);
  });
};

main().catch((err) => {
  console.log(err);
});
