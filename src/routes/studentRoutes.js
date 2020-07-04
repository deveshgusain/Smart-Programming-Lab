const express = require('express');
const passport = require('passport');
const debug = require('debug')('app:studentRoutes');

const studentRouter = express.Router();

function router() {
  studentRouter.route('/login')
    .get((req, res) => {
      res.render('studentLogin');
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
              if (err || !user || user.role !== 'student') {
                res.redirect('/student/login');
                return next();
              }
              req.login(user, async (error) => {
                if (error) return next(error);
                debug(user);
                return res.redirect('/student/selectLab');
              });
            } catch (error) {
              return next(error);
            }
          })(req, res, next);
      }
    );
  studentRouter.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });
  studentRouter.route('/selectLab')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/student/login');
      }
    })
    .get((req, res) => {
      res.render(
        'studentSelectLab',
        {
          username: req.user.username
        }
      );
    });
  studentRouter.route('/profile/:username')
    .get((req, res) => {
      res.render(
        'studentProfile',
        {
          username: req.user.username
        }
      );
    });
  return studentRouter;
}

module.exports = router;
