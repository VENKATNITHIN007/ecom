import express from "express"
import cors from "cors"
import { createVersionRoute } from "./utils/helper"
import errorHandler from "./middlewares/errorHandler.middleware"
import ApiError from "./utils/ApiError"
import connectToDB from "./db"
import userRouter from "./routes/user.router"
import cookieParser from "cookie-parser";




const allowedHost = process.env.ORIGIN_HOSTS ?
    process.env.ORIGIN_HOSTS.split(",").map((h) => h.trim()) : "*"

const port = process.env.PORT || 3001

const app = express()

app.use(express.json({ limit: "10MB" }))
app.use(express.urlencoded({ limit: "10MB", extended: true }))

/**
 * Cors
 */
app.use(cors({
    origin: allowedHost,
    credentials: true,
    optionsSuccessStatus: 200,
}));


/**
 * Routing
 */


app.use(createVersionRoute("users"), userRouter)
app.use(cookieParser());


/**
 * Error Handing
 */
app.use(errorHandler)

/**
* 404 errors
*/
app.use("*", function (req, res) {
    return res.status(404).json(new ApiError(404, "Page not found"))
})


connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.info(`Dukan backend is running on http://localhost:${port} in ${app.settings.env} mode`)
        })
    })
    .catch(err => console.error(err))