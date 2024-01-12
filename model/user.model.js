const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullName:String,
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    grade:{
        type: String,
    },
    gender:{
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    testStat:[{
        score:{
            type: Number,
        },
        testStartsTime: {
            type: String
        },
        testEndsTime: {
            type: String
        }
    }]
})

const User = mongoose.model("user", userSchema)

module.exports = User
