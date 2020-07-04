/* eslint-disable no-underscore-dangle */
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:submissionController');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

function submissionController() {
  function showSub(req, res) {
    const dbName = 'SmartLabApp';
    (async function mongo() {
      const questionId = req.query.question;
      let client;
      try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const col = await db.collection('submissions');
        let submissions;
        if (questionId) {
          submissions = await col.find({ userId: req.user._id, questionId }).toArray();
        } else {
          submissions = await col.find({ userId: req.user._id }).toArray();
        }

        res.render(
          'showSubmissions',
          {
            submissions,
            username: req.user.username
          }
        );
      } catch (err) {
        debug(err);
      }
    }());
  }
  function code(req, res) {
    const { id } = req.params;
    const dbName = 'SmartLabApp';
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const col = await db.collection('submissions');
        // eslint-disable-next-line no-underscore-dangle
        const submission = await col.findOne({ _id: new ObjectID(id) });
        const prog = submission.code.toString();
        debug(prog);
        res.render(
          'showCode',
          {
            submission,
            username: req.user.username,
            prog
          }
        );
      } catch (err) {
        debug(err);
      }
    }());
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/student/login');
    }
  }
  return { showSub, middleware, code };
}

module.exports = submissionController;
