const zod = require("zod")

const userSignup = zod.object({
    fullName: zod.string(),
    username: zod.string(),
    password: zod.string(),
    grade: zod.string(),
    gender: zod.string(),
})

const adminSignup = zod.object({
    username: zod.string(),
    password: zod.string(),
})

module.exports = {
    userSignup,
    adminSignup
}
