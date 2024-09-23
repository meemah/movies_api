import express, { json } from "express";

import { AppDataSource } from "./data-source";
import { AuthRouter } from "./routes/auth.routes";
import { DirectorRouter } from "./routes/director.routes";
import { GenreRouter } from "./routes/genre.routes";
import { studioRouter } from "./routes/studio.routes";

const { port } = require('./helpers/config');
const app = express()
app.use(json());
app.use("/auth", AuthRouter);
app.use("/api", GenreRouter);
app.use("/api", DirectorRouter);
app.use("/api", studioRouter);
AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Hi, I am listening on ${port}`)
    });

}).catch(error => console.log(error))
