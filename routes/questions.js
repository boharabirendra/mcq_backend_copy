const { Router } = require("express")
const { Question, ComputerBasics, NumberSystem, QbasicBasics, ModularProgramming, FileHandling, Introduction_to_C } = require("../model/questions.model")
const User = require("../model/user.model.js")
const { userMiddleware, doesUserSignedIn } = require("../middlewares/user.middlewares.js")
const router = Router()



let topics;


router.post("/selected/topics", (req, res) => {
  topics = req.body.selectedTopics
  res.status(200).json({
    message: "Selected topics received successfully"
  })
})


function returnSelectedTopics(selectedTopics) {
  const collectionFromWhereQuestionHaveToFetch = []
  selectedTopics.forEach(topic => {
    if (topic === "Computer basics") {
      collectionFromWhereQuestionHaveToFetch.push(ComputerBasics)
    } else if (topic === "Number system") {
      collectionFromWhereQuestionHaveToFetch.push(NumberSystem)
    } else if (topic === "Qbasic basics") {
      collectionFromWhereQuestionHaveToFetch.push(QbasicBasics)
    } else if (topic === "Modular programming & Array in Qbasic") {
      collectionFromWhereQuestionHaveToFetch.push(ModularProgramming)
    } else if (topic === "File handling") {
      collectionFromWhereQuestionHaveToFetch.push(FileHandling)
    } else if (topic === "Introduction to C programming") {
      collectionFromWhereQuestionHaveToFetch.push(Introduction_to_C)
    }
  })
  return collectionFromWhereQuestionHaveToFetch;
}


router.get("/all/:noOfQns", doesUserSignedIn, async (req, res) => {
  /*
  a: "Computer basics", computer_basics
  b: "Number system", number_systems
  c: "Qbasic basics", qbasic_basics
  d: "Modular programming & Array in Qbasic", modular_programming
  e: "File handling", file_handling
  f: "Introduction to C programming", intro_to_c
  */

  const collectionFromWhereQuestionHaveToFetch = returnSelectedTopics(topics)


  let questions = []
  let firstSetOfQns = []
  let secondSetOfQns = []
  let thirdSetOfQns = []
  let fourthSetOfQns = []
  let fifthSetOfQns = []
  let sixthSetOfQns = []

  const numberOfSeletedTopics = topics.length
  const simpleSize = parseInt(req.params.noOfQns)
  switch (numberOfSeletedTopics) {
    case 1:
      questions = await collectionFromWhereQuestionHaveToFetch[0].aggregate([{ $sample: { size: simpleSize } }]);
      break;
    case 2:
      firstSetOfQns = await collectionFromWhereQuestionHaveToFetch[0].aggregate([{ $sample: { size: 15 } }]);
      secondSetOfQns = await collectionFromWhereQuestionHaveToFetch[1].aggregate([{ $sample: { size: 15 } }]);
      questions = [...firstSetOfQns, ...secondSetOfQns]
      break;
    case 3:
      firstSetOfQns = await collectionFromWhereQuestionHaveToFetch[0].aggregate([{ $sample: { size: 10 } }]);
      secondSetOfQns = await collectionFromWhereQuestionHaveToFetch[1].aggregate([{ $sample: { size: 10 } }]);
      thirdSetOfQns = await collectionFromWhereQuestionHaveToFetch[2].aggregate([{ $sample: { size: 10 } }]);
      questions = [...fifthSetOfQns, ...secondSetOfQns, ...thirdSetOfQns]
      break;
    case 4:
      firstSetOfQns = await collectionFromWhereQuestionHaveToFetch[0].aggregate([{ $sample: { size: 7 } }]);
      secondSetOfQns = await collectionFromWhereQuestionHaveToFetch[1].aggregate([{ $sample: { size: 8 } }]);
      thirdSetOfQns = await collectionFromWhereQuestionHaveToFetch[2].aggregate([{ $sample: { size: 7 } }]);
      fourthSetOfQns = await collectionFromWhereQuestionHaveToFetch[3].aggregate([{ $sample: { size: 7 } }]);
      questions = [...fifthSetOfQns, ...secondSetOfQns, ...thirdSetOfQns, ...fourthSetOfQns]
      break;
    case 5:
      firstSetOfQns = await collectionFromWhereQuestionHaveToFetch[0].aggregate([{ $sample: { size: 6 } }]);
      secondSetOfQns = await collectionFromWhereQuestionHaveToFetch[1].aggregate([{ $sample: { size: 6 } }]);
      thirdSetOfQns = await collectionFromWhereQuestionHaveToFetch[2].aggregate([{ $sample: { size: 6 } }]);
      fourthSetOfQns = await collectionFromWhereQuestionHaveToFetch[3].aggregate([{ $sample: { size: 6 } }]);
      fifthSetOfQns = await collectionFromWhereQuestionHaveToFetch[4].aggregate([{ $sample: { size: 6 } }]);
      questions = [...fifthSetOfQns, ...secondSetOfQns, ...thirdSetOfQns, ...fourthSetOfQns, ...fifthSetOfQns]
      break;
    default:
      firstSetOfQns = await collectionFromWhereQuestionHaveToFetch[0].aggregate([{ $sample: { size: 5 } }]);
      secondSetOfQns = await collectionFromWhereQuestionHaveToFetch[1].aggregate([{ $sample: { size: 5 } }]);
      thirdSetOfQns = await collectionFromWhereQuestionHaveToFetch[2].aggregate([{ $sample: { size: 5 } }]);
      fourthSetOfQns = await collectionFromWhereQuestionHaveToFetch[3].aggregate([{ $sample: { size: 5 } }]);
      fifthSetOfQns = await collectionFromWhereQuestionHaveToFetch[4].aggregate([{ $sample: { size: 5 } }]);
      sixthSetOfQns = await collectionFromWhereQuestionHaveToFetch[5].aggregate([{ $sample: { size: 5 } }]);
      questions = [...fifthSetOfQns, ...secondSetOfQns, ...thirdSetOfQns, ...fourthSetOfQns, ...fifthSetOfQns, ...sixthSetOfQns]
      break;
  }
  res.json({
    questions
  })
})


router.post("/submittedAns", doesUserSignedIn, async (req, res) => {
  let obtainedScore = 0;
  let correctAns = [];
  const username = req.username;
  const submittedAns = req.body.selectedAnswers;
  const selectedTopics = req.body.selectedTopics;
  const questionId = Object.keys(submittedAns);
  const selectedAns = Object.values(submittedAns);

  const modelsFromWhichNeedToExtractCorrectAns = returnSelectedTopics(selectedTopics);

  try {
    for (const model of modelsFromWhichNeedToExtractCorrectAns) {
      const corrAns = await model.find({
        _id: {
          "$in": questionId
        }
      }, "ans");

      correctAns = [...correctAns, ...corrAns];
    }
    correctAns.forEach((corrAns) => {
      if (selectedAns.find((userAns) => userAns === corrAns.ans)) {
        obtainedScore++;
      }
    });

    await User.updateOne({
      username,
    }, {
      $push: {
        testStat: {
          score: obtainedScore,
          testStartsTime: req.body.testStartsTime,
          testEndsTime: req.body.testEndsTime,
        },
      },
    });

    res.json({
      message: "Submitted successfully",
    });
  } catch (error) {
    console.error("Error in processing submittedAns:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});


module.exports = router

