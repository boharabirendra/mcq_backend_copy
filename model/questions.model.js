const mongoose = require("mongoose")


const questionSchema = new mongoose.Schema({
    qns: String,
    opt: [String],
    ans: String
})

const Question = mongoose.model("questions", questionSchema)

module.exports = Question