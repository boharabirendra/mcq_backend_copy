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

app.use(cors({
    origin: "https://mcq-test-sys.netlify.app/",
    credentials: true
}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use("/admin", adminRouter)
app.use("/user", userRouter)
app.use("/questions", questionRouter)


dbConnection()
    .then(function () {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at ${process.env.PORT}`);
        })
    })
