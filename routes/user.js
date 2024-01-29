const { Router } = require("express")
const User = require("../model/user.model")
const { userSignup } = require("../types")
const { userExists, userMiddleware, doesUserSignedIn } = require("../middlewares/user.middlewares")
const jwt = require("jsonwebtoken")
const { upload } = require("../middlewares/multer.middlewares")
const { uploadOnCloudinary } = require("../middlewares/cloudinary.middlewares")


const router = Router()


router.post("/signup", userExists, upload.single("studImage"), async function (req, res) {
    const userPayLoad = req.body
    const parsedPayLoad = userSignup.safeParse(userPayLoad)
    if (!parsedPayLoad.success) {
        res.status(411).json({
            message: "Invalid inputs"
        })
        return;
    }
    let studImage = ""
    if (req.file) {
        try {
            const result = await uploadOnCloudinary(req.file.buffer);
            // Handle the result
            studImage = result.secure_url
        } catch (error) {
            // Handle the error
            res.status(500).json({
                message: 'File upload not successful',
                error,
            });
        }
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
        studImage,
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
    res.clearCookie("accessToken", { sameSite: "none", secure: true, httpOnly: true })
    res.status(200).json({
        message: "Logout successfully"
    })
})



module.exports = router
