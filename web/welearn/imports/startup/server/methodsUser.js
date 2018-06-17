import { Tests, TestResults, TestRewards, Donations, RewardTransactions, Currencies } from '../../api/collections'
import Web3 from 'web3'
import { sendTestResult } from './ethereum'

const isProduction = false
const wallKeysObj = Meteor.settings.private.wallKeysObj
const wallKeys = isProduction ? wallKeysObj.mainKeys : wallKeysObj.testKeysRopstein
const paymentAddressETH = wallKeys.pubAddress
const CONTRACT_ADDRESS = wallKeys.contractAddress

const addFixtures = () => {
  const testObj = {
    testName: "Ethereum 101",
    testCreator: "Admin",
    rewardETH: 0.005,
    timeMinute: 10,
    quizzesArr: [
      {
        question: 'What is one major difference between Bitcoin and Ethereum?',
        answersArr: [
          {
            index: 0,
            text: "Ethereum relies on Proof of Stake whilst Bitcoin relies on Proof of Work",
          },
          {
            index: 1,
            text: `Ethereum has a deflationary economic model and Bitcoin doesn't`,
          },
          {
            index: 2,
            text: "Ethereum is accepted by more merchants than Bitcoin",
          },
          {
            index: 3,
            text: `Ethereum's internal code is Turing Complete whilst Bitcoin's isn't`,
          },
        ],
        correctAnswerIndex: 3,
      },
      {
        question: 'What is an Ether in Ethereum?',
        answersArr: [
          {
            index: 0,
            text: `The main denomination used in Ethereum`,
          },
          {
            index: 1,
            text: `A anaesthetic liquid used to knock people out`,
          },
          {
            index: 2,
            text: `A name for the cloud computing process of Ethereum contracts`,
          },
          {
            index: 3,
            text: "A method of redistributing Ethereum via mining"
          },
        ],
        correctAnswerIndex: 0,
      },
      {
        question: 'What is gas in Ethereum?',
        answersArr: [
          {
            index: 0,
            text: `The cost of generating a correct block hash`,
          },
          {
            index: 1,
            text: `A way of pricing transactions based on their computational complexity`,
          },
          {
            index: 2,
            text: `A measurement of how many nodes are attached to the network`,
          },
          {
            index: 3,
            text: "How much power the network has securing it in Giga Hashes"
          },
        ],
        correctAnswerIndex: 1,
      },
    ]
  }

  const hasTest = Tests.findOne({})
  let testId
  if (!hasTest) {
    testId = Tests.insert(testObj)
  } else {
    testId = hasTest._id
  }
  const donationObj = {
    userId: "userId",
    amountEth: 0.1,
    transactionHash: 'transactionHash',
    createdAt: new Date(),
  }
  const hasDonation = Donations.findOne({})
  if (!hasDonation) {
    Donations.insert(donationObj)
  }
  const testResultsObj = {
    userId: "mEFt7sfQDfpTBLkzf",
    testId,
    testScore: 91,
    rewardedETH: 0.05,
    createdAt: new Date(),
  }
  const hasTestResult = TestResults.findOne({})
  if (!hasTestResult) {
    TestResults.insert(testResultsObj)
  }

  const currencyObj = {
    currencySymbol: 'ETH',
    currencyName: 'Ethereum',
    createdAt: new Date(),
    updatedAt: new Date(),
    currencyPrice: 500,
  }
  const hasCurrency = Currencies.findOne({})
  if (!hasCurrency) {
    Currencies.insert(currencyObj)
  }
}

addFixtures()

const updateCurrencyPrice = () => {
  const uri = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`
  HTTP.call("GET", uri, {}, Meteor.bindEnvironment(function (error, response) {
    if (error) {
      console.log(error);
    }
    if (response && response.data) {
      const { USD } = response.data
      if (USD) {
        Currencies.update({ currencySymbol: 'ETH' }, { $set: { currencyPrice: USD } })
      }
    }
  }))
}

updateCurrencyPrice()
Meteor.setInterval(() => {
  updateCurrencyPrice()
}, 20 * 1000)

Meteor.methods({
  updateAccountType(userAccountType) {
    check(userAccountType, String)
    const userId = Meteor.userId()
    if (userId) {
      if (userAccountType === 'student' || userAccountType === 'donor') {
        Meteor.users.update({ _id: userId }, { $set: { 'profile.userAccountType': userAccountType } })
        if (userAccountType === 'donor') {
          Meteor.users.update({ _id: userId }, { $set: { 'profile.paymentAddressETH': CONTRACT_ADDRESS } })
        }
      }
    }
  },
  submitTest({ testId, answersArr }) {
    check(answersArr, Array)
    check(testId, String)
    let resultObj = { success: false }
    const userId = Meteor.userId()
    if (userId) {
      const user = Meteor.user()
      const { profile } = user
      const { userAccountType } = profile || {}
      if (userAccountType === 'student') {
        if (answersArr && answersArr.length > 0) {
          if (answersArr.length < 20) {
            const hasTestResult = TestResults.findOne({ userId, testId })
            if (!hasTestResult) {
              const test = Tests.findOne({ _id: testId })
              if (test) {
                const { quizzesArr } = test
                let totalScore = 0
                answersArr.forEach((answerObj) => {
                  const { quizIndex, answerIndex } = answerObj
                  if (quizzesArr[quizIndex].correctAnswerIndex === answerIndex) {
                    totalScore += 1
                  }
                })
                const arrLength = quizzesArr.length || 10
                const percentage = parseInt((totalScore / arrLength) * 100, 10)
                const rewardUnitETH = 0.001
                let rewardETH = 0
                if (percentage >= 60 && percentage < 70) {
                  rewardETH += 1 * rewardUnitETH
                } else if (percentage >= 70 && percentage < 80) {
                  rewardETH += 2 * rewardUnitETH
                } else if (percentage >= 80 && percentage < 90) {
                  rewardETH += 3 * rewardUnitETH
                } else if (percentage >= 90 && percentage < 100) {
                  rewardETH += 4 * rewardUnitETH
                } else if (percentage === 100) {
                  rewardETH += 5 * rewardUnitETH
                }
                const testResult = {
                  userId,
                  testId,
                  answersArr,
                  percentage,
                  rewardETH,
                  rewardUnitETH,
                  createdAt: new Date(),
                }
                TestResults.insert(testResult)
                console.log(`Send ${rewardUnitETH} ETH!`)
                Meteor.users.update({ _id: userId }, { $inc: { 'profile.totalEarnedETH': rewardETH, 'profile.totalTests': 1, 'profile.successfulTests': (percentage >= 60 ? 1 : 0) } })
                const textMsg = rewardETH > 0 ? `Great! You scored: ${percentage}%. ${rewardUnitETH} ETH is getting sent to your ethereum account!` : `it was close! You scored: ${percentage}%.`
                resultObj = { success: true, msg: textMsg }
                const ethAddress = (user && user.profile && user.profile.ethAddress) || "0xD69B652ae820fa50D202eC2Ad2996a9Ed798133d"
                if (ethAddress && percentage >= 60) {
                  Meteor.defer(() => {
                    sendTestResult({ userEthAddress: ethAddress, percentage })
                  })
                }
              } else {
                resultObj = { success: false, msg: 'No such test!' }
              }
            } else {
              resultObj = { success: false, msg: `You've already taken the test!` }
            }
          } else {
            resultObj = { success: false, msg: 'Too many asnwers' }
          }
        } else {
          resultObj = { success: false, msg: 'No answer submitted!' }
        }
      } else {
        resultObj = { success: false, msg: 'Account type is not allowed!' }
      }
    } else {
      resultObj = { success: false, msg: 'No account!' }
    }
    return resultObj
  },
  saveETHAddress(newETHAddress) {
    check(newETHAddress, String)
    const userId = Meteor.userId()
    if (userId) {
      Meteor.users.update({ _id: userId }, { $set: { 'profile.ethAddress': newETHAddress } })
    }
  },
})
