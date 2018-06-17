Meteor.methods({
  updateAccountType(userAccountType) {
    check(userAccountType, String)
    const userId = Meteor.userId()
    if (userId) {
      if (userAccountType === 'student' || userAccountType === 'donor') {
        Meteor.users.update({ _id: userId }, { $set: { 'profile.userAccountType': userAccountType } })
      }
    }
  },
})
