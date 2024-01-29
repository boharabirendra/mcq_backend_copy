const jwt = require("jsonwebtoken")
const User = require("../model/user.model")

async function userExists(req, res, next) {
  const username = req.body.username
  const user = await User.findOne({
    username,
  })
  if (user) {
    res.status(409).json({
      message: "User with this name already exits"
    })
    return;
  } else {
    next()
  }
}

async function userMiddleware(req, res, next) {
  try {
    const username = req.body.username
    const password = req.body.password
    const user = await User.findOne({
      username,
      password
    })
    if (user) {
      next()
    } else {
      res.status(403).json({
        message: "User does not exits"
      })
    }
  } catch (error) {
    res.json({
      error,
    })
  }
}


function doesUserSignedIn(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(" ")[1]
    if (!accessToken) {
      return res.redirect("/")
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    req.username = decoded.username
    next()
  } catch (error) {
    res.json({
      error,
    })
  }
}

module.exports = { userExists, userMiddleware, doesUserSignedIn }
