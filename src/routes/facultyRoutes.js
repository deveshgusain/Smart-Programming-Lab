const express = require('express');
const passport = require('passport');
const debug = require('debug')('app:facultyRoutes');
const { MongoClient, ObjectID } = require('mongodb');

const facultyRouter = express.Router();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

function router() {
  facultyRouter.route('/login')
    .get((req, res) => {
      res.render('facultyLogin');
    })
    .post(
      // passport.authenticate('local',
      // {
      //   successRedirect: '/student/selectLab',
      //   failureRedirect: '/student/login'
      // }
      async (req, res, next) => {
        passport.authenticate('local',
          async (err, user, info) => {
            try {
              if (err || !user || user.role !== 'faculty') {
                res.redirect('/faculty/login');
                return next();
              }
              req.login(user, async (error) => {
                if (error) return next(error);
                debug(user);
                return res.redirect('/faculty/selectLab');
              });
            } catch (error) {
              return next(error);
            }
          })(req, res, next);
      }
    );
  facultyRouter.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });
  facultyRouter.route('/selectLab')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/faculty/login');
      }
    })
    .get((req, res) => {
      debug(req.body);
      res.render(
        'facultySelectLab',
        {
          username: req.user.username
        }
      );
    });
  facultyRouter.route('/Lab')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/faculty/login');
      }
    })
    .get((req, res) => {
      debug(req.query.lab);
      const dbName = 'SmartLabApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);
          const col = await db.collection('submissions');
          const col1 = await db.collection('users');
          const allSub = [];
          for (let j = 0; j < 10; j += 1) { // 10 = total lab
            // eslint-disable-next-line no-await-in-loop
            const submissions = await col.find({ lab: req.query.lab, questionNo: j + 1 }).toArray();
            for (let i = 0; i < submissions.length; i += 1) {
              // eslint-disable-next-line no-await-in-loop
              const roll = await col1.findOne({ _id: new ObjectID(submissions[i].userId) });
              if (!roll) {
                submissions[i].roll = '--';
              } else {
                submissions[i].roll = roll.username;
              }
            }
            allSub.push(submissions);
          }
          res.render(
            'facultyLabTable',
            {
              allSub,
              username: req.user.username
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return facultyRouter;
}

module.exports = router;
