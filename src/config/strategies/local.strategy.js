const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

module.exports = function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    const dbName = 'SmartLabApp';

    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);
        const col = db.collection('users');
        const user = await col.findOne({ username });

        if (user && user.password === password) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        debug(err);
      }
      client.close();
    }());
  }));
};
