const mongoose = require("mongoose")

const takeTestSchema = new mongoose.Schema({
    username: String,
    testSet: []
})

const TestTaken = mongoose.model("test_taken", takeTestSchema)

module.exports = {
    TestTaken
}