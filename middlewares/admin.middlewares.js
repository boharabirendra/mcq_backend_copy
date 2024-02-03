const { Admin } = require("../model/admin.model");
const jwt = require("jsonwebtoken")


async function adminExists(req, res, next) {
    const username = req.body.username
    const admin = await Admin.findOne({
        username,
    })
    if (admin) {
        res.status(409).json({
            message: "Admin with this name already exits"
        })
        return
    } else {
        next()
    }
}


function doesAdminSignedIn(req, res, next) {
    try {
        const accessToken = req.headers.authorization.split(" ")[1]
        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(401).json({
            error,
        })
    }
}



function adminMiddleware(req, res, next) {
    try {
        const username = req.body.username
        const password = req.body.password
        Admin.findOne({
            username,
            password
        })
            .then(function (admin) {
                if (admin) {
                    next()
                } else {
                    res.status(403).json({
                        message: "Admin does not exists"
                    })
                }
                return;
            })
    } catch (error) {
        res.status(403).json({
            error,
        })
    }
}

module.exports = { adminMiddleware, adminExists, doesAdminSignedIn }
