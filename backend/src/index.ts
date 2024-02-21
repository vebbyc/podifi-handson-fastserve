import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import path from "path";
import menuRoutes from '../src/routes/menu'
import orderRoutes from '../src/routes/order'
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string, {
    dbName: "dev",
});
// Define a middleware to log queries
mongoose.set('debug', function (collectionName, method, query, doc, options) {
    // ANSI escape code for blue color
    const blueColor = '\x1b[34m';
    // ANSI escape code to reset color
    const resetColor = '\x1b[0m';

    console.log(blueColor + `Mongoose: ${collectionName}.${method}`, JSON.stringify(query), doc, options + resetColor);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use("/api/menu", menuRoutes)
app.use("/api/order", orderRoutes)


/** Base URL API: https://localhost:3000 */
app.listen(3000, () => {
    console.log("server running on localhost: 3000")
}
);