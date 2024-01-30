const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const cors = require("cors")
const adminRouter = require("./routes/admin.js")
const userRouter = require("./routes/user.js")
const questionRouter = require("./routes/questions.js")
const dbConnection = require("./db/index.js")
const cookieParser = require("cookie-parser")
const app = express()

dotenv.config({
    path: "./.env"
})
const corsOptions = {
    origin: "http://localhost:5173",
    // origin: 'https://mcq-test-sys.netlify.app',
    credentials: true,  // This enables the credentials (cookies, headers) to be included in the CORS request
};

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

app.use("/admin", adminRouter)
app.use("/user", userRouter)
app.use("/questions", questionRouter)





dbConnection()
    .then(function () {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at ${process.env.PORT}`);
        })
    })






