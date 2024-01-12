const { Router } = require("express")
const Question = require("../model/questions.model")
const User = require("../model/user.model.js")
const { userMiddleware, doesUserSignedIn } = require("../middlewares/user.middlewares.js")
const router = Router()

router.get("/all/:noOfQns", doesUserSignedIn, async (req, res) => {
  const simpleSize = parseInt(req.params.noOfQns)
  const questions = await Question.aggregate([{ $sample: { size: simpleSize } }]);
  const questionsWithOutAns = questions.map(question => {
    const { ans, ...rest } = question
    return rest
  })
  res.json({
    questionsWithOutAns
  })
})


router.post("/submittedAns", doesUserSignedIn, async (req, res) => {
  let obtainedScore = 0
  const username = req.username
  const submittedAns = req.body.selectedAnswers
  const questionId = Object.keys(submittedAns)
  const selectedAns = Object.values(submittedAns)
  const correctAns = await Question.find({
    _id: {
      "$in": questionId
    }
  }, "ans")

  correctAns.forEach(corrAns => {
    if (selectedAns.find(userAns => userAns === corrAns.ans)) {
      obtainedScore++
    }
  });


  await User.updateOne({
    username,
  }, {
    "$push": {
      testStat: {
        score: obtainedScore,
        testStartsTime: req.body.testStartsTime,
        testEndsTime: req.body.testEndsTime
      }
    }
  })
  res.json({
    obtainedScore,
  })
})


module.exports = router

