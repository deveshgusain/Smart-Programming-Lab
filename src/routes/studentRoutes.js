const express = require('express');
const passport = require('passport');

const studentRouter = express.Router();

function router() {
  studentRouter.route('/login')
    .get((req, res) => {
      res.render('studentLogin');
    })
    .post(passport.authenticate('local', {
      successRedirect: '/student/selectLab',
      failureRedirect: '/student/login'
    }));
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
