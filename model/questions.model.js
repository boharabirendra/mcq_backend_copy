const mongoose = require("mongoose")


const questionSchema = new mongoose.Schema({
    topic:String,
    qns: String,
    opt: [String],
    ans: String
})

const ComputerBasics = mongoose.model("computer_basics", questionSchema)
const NumberSystem = mongoose.model("number_system", questionSchema)
const AlgorithmFlowChart = mongoose.model("algorithm_flowchar", questionSchema)
const QbasicBasics = mongoose.model("qbasic_basics", questionSchema)
const ControlStatement = mongoose.model("control_statement", questionSchema)
const FileHandling = mongoose.model("file_handling", questionSchema)
const ModularProgramming = mongoose.model("modular_programming", questionSchema)
const Question = mongoose.model("question", questionSchema)
const Introduction_to_C = mongoose.model("intro_to_c", questionSchema)

module.exports = {
    Question,
    ComputerBasics,
    NumberSystem,
    AlgorithmFlowChart,
    QbasicBasics,
    ControlStatement,
    FileHandling,
    ModularProgramming,
    Introduction_to_C
}