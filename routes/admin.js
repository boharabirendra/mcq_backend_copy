const { Router } = require("express")
const { adminSignup } = require("../types")
const { Admin } = require("../model/admin.model")
const jwt = require("jsonwebtoken")
const { adminMiddleware, adminExists, doesAdminSignedIn } = require("../middlewares/admin.middlewares")
const User = require("../model/user.model")
const router = Router()


router.post("/signup", adminExists, (req, res) => {
    const adminPayLoad = req.body
    const parsedAdminPayLoad = adminSignup.safeParse(adminPayLoad)
    if (!parsedAdminPayLoad.success) {
        res.status(411).json({
            message: "Invaild input"
        })
        return;
    }
    const username = adminPayLoad.username
    const password = adminPayLoad.password
    Admin.create({
        username,
        password,
    })
        .then(function () {
            res.status(200).json({
                message: "Admin created successfully"
            })
            return;
        })
})

router.post("/signin", adminMiddleware, (req, res) => {
    try {
        const username = req.body.username
        const adminAccessToken = jwt.sign({
            username,
        }, process.env.JWT_SECRET)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
        res.status(200)
            .cookie("accessToken", adminAccessToken, options)
            .json({
                adminAccessToken,
            })
    } catch (error) {
        res.json({
            error,
        })
    }
})

router.get("/users/all", doesAdminSignedIn, async (req, res) => {
    const users = await User.find({}).select("-username -password").sort({ "fullName": 1 })
    if (users.length >= 1) {
        res.status(200)
            .json({
                users,
            })
    } else {
        res.status(403)
            .json({
                message: "No result found"
            })
    }
})





module.exports = router
