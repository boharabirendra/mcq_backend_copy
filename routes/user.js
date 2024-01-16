const { Router } = require("express")
const User = require("../model/user.model")
const { userSignup } = require("../types")
const { userExists, userMiddleware, doesUserSignedIn } = require("../middlewares/user.middlewares")
const jwt = require("jsonwebtoken")


const router = Router()


router.post("/signup", userExists, function (req, res) {

    const userPayLoad = req.body
    const parsedPayLoad = userSignup.safeParse(userPayLoad)
    if (!parsedPayLoad.success) {
        res.status(411).json({
            message: "Invalid inputs"
        })
        return;
    }
    const fullName = userPayLoad.fullName
    const username = userPayLoad.username
    const password = userPayLoad.password
    const grade = userPayLoad.grade
    const gender = userPayLoad.gender
    User.create({
        fullName,
        username,
        password,
        grade,
        gender,
    })
        .then(function () {
            res.status(200).json({
                message: "User created successfully"
            })
        })
        .catch(function (error) {
            res.json({
                error,
            })
        })
})

router.post("/signin", userMiddleware, (req, res) => {
    try {
        const username = req.body.username
        const accessToken = jwt.sign({
            username,
        }, process.env.JWT_SECRET)
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
        res.status(200)
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" })
            .json({
                message: "login successfully",
                accessToken,
            })

    } catch (error) {
        res.json({
            error,
        })
    }
})


router.get("/1", doesUserSignedIn, (req, res) => {
    const username = req.username
    User.findOne({
        username,
    })
        .then(user => {
            res.status(200)
                .json({
                    user,
                })
        })
        .catch(error => {
            res.status(500)
                .json({
                    error,
                })
        })
})

router.post("/logout", doesUserSignedIn, (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.clearCookie("accessToken")
    res.status(200).json({
        message: "Logout successfully"
    })
})



module.exports = router
