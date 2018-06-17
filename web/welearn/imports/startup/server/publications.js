import {
  Currencies,
  Tests,
  TestResults,
  TestRewards,
  Donations,
  RewardTransactions,
} from "../../api/collections";

Meteor.publish("currencies", function () {
  return Currencies.find({}, { limit: 1 })
})
