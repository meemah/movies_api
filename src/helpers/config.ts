
import dotenv from "dotenv";

dotenv.config()

module.exports = {
    port: process.env.PORT,
    database: process.env.DATABASE,
    databaseUsername: process.env.DATABASE_USERNAME,
    databasePassword: process.env.DATABASE_PASSWORD,
    jwtSecret: process.env.JWT_SECRET
}