const { Router } = require("express")
const { adminSignup } = require("../types")
const { Admin } = require("../model/admin.model")
const jwt = require("jsonwebtoken")
const { adminMiddleware, adminExists, doesAdminSignedIn } = require("../middlewares/admin.middlewares")
const User = require("../model/user.model")
const XLSX = require('xlsx');
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

        res.status(200)
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
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 10
    const filterText = req.query.filter
    const startIndex = (page - 1) * pageSize
    const endIndex = page * pageSize
    const query = {
        fullName: {
            $regex: filterText, $options: 'i'
        }
    }
    const totalItems = await User.countDocuments(query)
    const users = await User.find(query)
        .skip(startIndex).limit(pageSize)
        .select("-username -password").sort({ "fullName": 1 })

    res.status(200)
        .json({
            users,
            totalPages: Math.ceil(totalItems / pageSize)
        })
})

router.get("/users/export/all", doesAdminSignedIn, async (req, res) => {

    const users = await User.find({})
        .select("-username -password").sort({ "fullName": 1 })
    const dataToExport = users.map(item => ({
        Full_Name: item.fullName,
        Grade: item.grade,
        Gender: item.gender,
        Test_Score: item.testStat.map(obj => JSON.stringify(obj.score)).join(', '),
    }))
    res.status(200)
        .json({
            dataToExport,
        })
})


module.exports = router
