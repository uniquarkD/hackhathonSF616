import {
  Currencies,
  Tests,
  TestResults,
  TestRewards,
  Donations,
  RewardTransactions,
} from "../../api/collections"

Meteor.publish("currencies", function () {
  return Currencies.find({}, { limit: 1 })
})

Meteor.publish("tests", function (limit) {
  return Tests.find({}, { sort: { createdAt: -1 }, limit: limit || 10, fields: { quizzesArr: 0, correctAnswerIndex: 0 } })
})

Meteor.publish("singleTest", function (testId) {
  return Tests.find({ _id: testId }, { fields: { correctAnswerIndex: 0 } })
})
