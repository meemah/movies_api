import express, { json } from "express";

import { AppDataSource } from "./data-source";
import { ErrorHandler } from "./middlewares/errorhandler_middleware";
import { AuthRouter } from "./routes/auth.routes";
import { CastRouter } from "./routes/cast.routes";
import { DirectorRouter } from "./routes/director.routes";
import { GenreRouter } from "./routes/genre.routes";
import { ReviewRouter } from "./routes/review.routes";
import { StudioRouter } from "./routes/studio.routes";

const { port } = require('./helpers/config');
const app = express()
app.use(json());

app.use("/auth", AuthRouter);
app.use("/api", GenreRouter,);
app.use("/api", DirectorRouter);
app.use("/api", StudioRouter);
app.use("/api", CastRouter);
app.use("/api", ReviewRouter);
app.use(ErrorHandler)
AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Hi, I am listening on ${port}`)
    });

}).catch(error => console.log(error))
