const { Router } = require("express")
const { Question, ComputerBasics, NumberSystem, QbasicBasics, ModularProgramming, FileHandling, Introduction_to_C } = require("../model/questions.model")
const User = require("../model/user.model.js")
const { userMiddleware, doesUserSignedIn } = require("../middlewares/user.middlewares.js")
const { TestTaken } = require("../model/taken_test.model.js")
const router = Router()



let topics;


async function randomlyQuestionIdsGenerator(model, numberOfQuestions) {
  const allQuestionIds = []
  const randomlySelectedQuestionIds = []
  const allQnsIds = await model.find({}, { projection: { _id: 1 } })
  allQnsIds.forEach(id => {
    allQuestionIds.push(id._id)
  })
  const lengthOfAllQuestionIds = allQuestionIds.length
  for (let index = 0; index < numberOfQuestions; index++) {
    const randomIndex = Math.floor(Math.random() * lengthOfAllQuestionIds) + 1;
    randomlySelectedQuestionIds.push(allQuestionIds[randomIndex])
  }
  return randomlySelectedQuestionIds
}


async function randomlyQuestionsSelector(model, questionsIds) {
  const questions = await model.find({
    _id: {
      "$in": questionsIds
    }
  }).select("-ans");
  return questions
}

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
  let questionsIds = []
  const numberOfSeletedTopics = topics.length
  const simpleSize = parseInt(req.params.noOfQns)
  switch (numberOfSeletedTopics) {
    case 1:
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[0], Math.floor(simpleSize))
      questions = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[0], questionsIds)
      break;
    case 2:
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[0], simpleSize / 2)
      firstSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[0], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[1], simpleSize / 2)
      secondSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[1], questionsIds)
      questions = [...firstSetOfQns, ...secondSetOfQns]
      break;
    case 3:

      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[0], simpleSize / 3)
      firstSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[0], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[1], simpleSize / 3)
      secondSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[1], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[2], simpleSize / 3)
      thirdSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[2], questionsIds)
      questions = [...fifthSetOfQns, ...secondSetOfQns, ...thirdSetOfQns]
      break;
    case 4:

      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[0], simpleSize / 5 + 1)
      firstSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[0], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[1], simpleSize / 5 + 2)
      secondSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[1], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[2], simpleSize / 5 + 1)
      thirdSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[2], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[3], simpleSize / 5 + 2)
      fourthSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[3], questionsIds)
      questions = [...fifthSetOfQns, ...secondSetOfQns, ...thirdSetOfQns, ...fourthSetOfQns]
      break;
    case 5:
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[0], simpleSize / 5)
      firstSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[0], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[1], simpleSize / 5)
      secondSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[1], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[2], simpleSize / 5)
      thirdSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[2], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[3], simpleSize / 5)
      fourthSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[3], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[4], simpleSize / 5)
      fifthSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[4], questionsIds)
      questions = [...fifthSetOfQns, ...secondSetOfQns, ...thirdSetOfQns, ...fourthSetOfQns, ...fifthSetOfQns]
      break;
    default:
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[0], simpleSize / 6)
      firstSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[0], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[1], simpleSize / 6)
      secondSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[1], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[2], simpleSize / 6)
      thirdSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[2], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[3], simpleSize / 6)
      fourthSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[3], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[4], simpleSize / 6)
      fifthSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[4], questionsIds)
      questionsIds = await randomlyQuestionIdsGenerator(collectionFromWhereQuestionHaveToFetch[5], simpleSize / 6)
      sixthSetOfQns = await randomlyQuestionsSelector(collectionFromWhereQuestionHaveToFetch[5], questionsIds)
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

    await TestTaken.create({
      username,
      testSet: submittedAns
    })

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


router.get("/taken/test", doesUserSignedIn, async (req, res) => {
  const takenTestQns = []

  const tests = await TestTaken.find({
    username: req.username
  })

  const user = await User.findOne({
    username: req.username
  })
  for (const test of tests) {
    const questions = []
    const attemptedQnsAndAns = test.testSet
    const attemptedQnsIds = Object.keys(attemptedQnsAndAns[0])
    const computer_basics = await ComputerBasics.find({
      _id: {
        "$in": attemptedQnsIds
      }
    }).lean();
    const number_systems = await NumberSystem.find({
      _id: {
        "$in": attemptedQnsIds
      }
    }).lean();
    const file_handling = await FileHandling.find({
      _id: {
        "$in": attemptedQnsIds
      }
    }).lean();
    const modular_programming = await ModularProgramming.find({
      _id: {
        "$in": attemptedQnsIds
      }
    }).lean();
    const qbasic_basics = await QbasicBasics.find({
      _id: {
        "$in": attemptedQnsIds
      }
    }).lean();
    const intro_to_c = await Introduction_to_C.find({
      _id: {
        "$in": attemptedQnsIds
      }
    }).lean();
    questions.push(...computer_basics, ...number_systems, ...file_handling, ...modular_programming, ...intro_to_c, ...qbasic_basics)
    const questionsWithUsesSelectedAns = questions.map(question => {
      question["submittedAns"] = attemptedQnsAndAns[0][question._id]
      return question;
    })

    takenTestQns.push(questionsWithUsesSelectedAns)
  }
  res.status(200).json({
    takenTestQns,
    testStat: user.testStat
  })
})

module.exports = router

