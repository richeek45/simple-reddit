"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const ioredis_1 = __importDefault(require("ioredis"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const path_1 = __importDefault(require("path"));
const Updoot_1 = require("./entities/Updoot");
const createUserLoader_1 = require("./utils/createUserLoader");
const createUpdootLoader_1 = require("./utils/createUpdootLoader");
const main = async () => {
    const result = dotenv_1.default.config({ path: "config.env" });
    if (result.error) {
        throw result.error;
    }
    console.log(result.parsed);
    const conn = await (0, typeorm_1.createConnection)({
        type: "postgres",
        database: "lireddit2",
        username: "postgres",
        password: "Richeek45",
        logging: true,
        synchronize: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [Post_1.Post, User_1.User, Updoot_1.Updoot],
    });
    await conn.runMigrations();
    const app = (0, express_1.default)();
    let RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    let redis = new ioredis_1.default();
    var allowedOrigins = [
        "http://localhost:3000",
        "https://studio.apollographql.com",
    ];
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        },
        saveUninitialized: false,
        secret: "learning",
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: async ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: (0, createUserLoader_1.createUserLoader)(),
            updootLoader: (0, createUpdootLoader_1.createUpdootLoader)(),
        }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.get("/", (_, res) => {
        res.send("hello!");
    });
    const options = {
        key: fs_1.default.readFileSync("localhost+1-key.pem"),
        cert: fs_1.default.readFileSync("localhost+1.pem"),
    };
    https_1.default.createServer(options, app).listen(process.env.PORT, () => {
        console.log(`server started at localhost ${process.env.PORT}!`);
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map