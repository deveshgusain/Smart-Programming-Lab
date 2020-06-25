const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:studentRoutes');

const studentRouter = express.Router();

function router() {
  studentRouter.route('/login')
    .get((req, res) => {
      res.render('studentLogin');
    })
    .post((req, res) => {
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'SmartLabApp';
      (async function checkUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          debug(username);
          const db = client.db(dbName);
          const col = db.collection('students');
          const user = await col.findOne({ username });
          debug(user);
          if (user != null && user.password === password) {
            res.redirect('/student/selectLab');
          } else {
            res.redirect('/student/login');
          }
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });
  studentRouter.route('/selectLab')
    .get((req, res) => {
      res.render('studentSelectLab');
    });
  // studentRouter.route('/dsaLabTable')
  //   .get((req, res) => {
  //     res.render('dsaStudentLabTable');
  //   });
  // studentRouter.route('/daaLabTable')
  //   .get((req, res) => {
  //     res.render('daaStudentLabTable');
  //   });
  return studentRouter;
}

module.exports = router;
