import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cast } from "./entity/Cast.entity";
import { Director } from "./entity/Director.entity";
import { Genre } from "./entity/Genre.entity";
import { Review } from "./entity/Review.entity";
import { Studio } from "./entity/Studio.entity";
import { User } from "./entity/User";
const { databasePassword, databaseUsername, database } = require('./helpers/config');
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: databaseUsername,
    password: databasePassword,
    database: database,
    synchronize: true,
    logging: false,
    entities: [User, Genre, Director, Studio, Cast, Review],
    migrations: [],
    subscribers: [],
})
