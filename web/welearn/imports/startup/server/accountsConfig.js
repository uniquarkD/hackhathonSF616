import { ServiceConfiguration } from 'meteor/service-configuration';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const isProduction = false
const facebookKeysObj = isProduction ? Meteor.settings.services.facebook.prod : Meteor.settings.services.facebook.dev

Meteor.startup(function () {
  console.log('Meteor.startup Meteor.startup Meteor.startup Meteor.startup Meteor.startup Meteor.startup Meteor.startup');
  if (process.env.NODE_ENV === "development") {
    //process.env.MAIL_URL = Meteor.settings["galaxy.meteor.com"].env.MAIL_URL;
  }
  const admin = Meteor.settings.private.defaultAdmin;
  if (Meteor.users.find().count() === 0) {
    Accounts.createUser(admin);
  } else if (
    Meteor.users.find({ username: admin.username }).count() === 0 && Meteor.users.find({ emails: admin.email }).count() === 0
  ) {
    Accounts.createUser(admin)
  }
  const adminUserName = Meteor.settings.private.defaultAdmin.username;
  const adminUser = Meteor.users.findOne({ username: adminUserName });
  if (adminUser) {
    if (!Roles.userIsInRole(adminUser._id, "admin")) {
      Roles.setUserRoles(adminUser._id, "admin");
    } else {
      console.log("in role")
    }
  }

  Accounts.urls.resetPassword = (token) => {
    return Meteor.absoluteUrl(`reset-password/${token}`);
  };
  Accounts.emailTemplates.siteName = "Welearn";
  Accounts.emailTemplates.from = "Welearn <support@welearn.meteorapp.com>"
  if (process.env.ROOT_URL === "http://localhost:3000/" || process.env.ROOT_URL === "http://localhost:3000") {
    ServiceConfiguration.configurations.remove({
      service: 'facebook',
    });
    ServiceConfiguration.configurations.upsert(
      { service: "facebook" },
      {
        $set: {
          appId: facebookKeysObj.appId,
          secret: facebookKeysObj.secret,
        },
      }
    );
  } else {
    ServiceConfiguration.configurations.remove({
      service: 'facebook',
    });
    ServiceConfiguration.configurations.upsert(
      { service: "facebook" },
      {
        $set: {
          appId: facebookKeysObj.appId,
          secret: facebookKeysObj.secret,
        },
      }
    );
  }
  Accounts.onCreateUser(function (options, user) {
    let userExtended = user
    let profile = {}
    let userFirstName = ''
    if (user && !(user.emails && user.emails[0]) && user.services && user.services.facebook) {
      const facebookObj = user.services.facebook
      console.log(facebookObj);
      const { email, name, first_name, last_name, gender, age_range, locale, link } = facebookObj
      const fbProfile = { email, name, firstName: first_name, lastName: last_name, gender, ageRange: age_range, locale, link, createdAt: new Date() }
      let emails;
      if (email) {
        emails = [{ address: email, verified: true }]
      }
      profile = Object.assign({}, fbProfile, options.profile)
      userExtended = Object.assign({}, user, { emails, profile })
      userFirstName = first_name
    } else {
      const { firstName, lastName } = options.profile
      const email = (user && user.emails && user.emails[0]) ? user.emails[0].address : ''
      profile = Object.assign({}, options.profile, { name: `${firstName} ${lastName}`, email })
      userExtended = Object.assign({}, user, { profile })
      userFirstName = firstName
      Meteor.defer(() => {
        updateGenderStatistics({ firstName })
      })
    }
    return userExtended;
  });
});
