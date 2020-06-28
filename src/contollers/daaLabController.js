/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-else-return */

const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:daaLabController');
const fs = require('fs');
const multer = require('multer');
const hackerEarth = require('hackerearth-node');
const chalk = require('chalk');

// eslint-disable-next-line new-cap
const hackerearth = new hackerEarth(
  'a21190f58028e670fba2578dfe0659d1db012f51', // Your Client Secret Key here this is mandatory
  '0'// mode sync=1 or async(optional)=0 or null async is by default and preferred for nodeJS
);

// mutter for save submiited file to disk storage. After executing it will be deleted
let fileName;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  }
});

function daaLabController() {
  function getIndex(req, res) {
    const url = process.env.MONGODB_URI;
    const dbName = 'SmartLabApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);
        const col = await db.collection('daaQuestions');
        const questions = await col.find().toArray();
        res.render(
          'daaStudentLabTable',
          {
            questions,
            username: req.user.username
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getById(req, res) {
    const { id } = req.params;
    const url = process.env.MONGODB_URI;
    const dbName = 'SmartLabApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        const db = client.db(dbName);
        const col = await db.collection('daaQuestions');
        const question = await col.findOne({ _id: new ObjectID(id) });
        res.render(
          'daaQuestion',
          {
            question,
            username: req.user.username,
            result: null,
            score: null
          }
        );
      } catch (err) {
        debug(err.stack);
      }
    }());
  }
  function putById(req, res) {
    const upload = multer({ storage }).single('myfile');

    upload(req, res, (err) => {
      // eslint-disable-next-line consistent-return
      // if file is empty or other error
      if (req.fileValidationError || !req.file || err instanceof multer.MulterError || err) {
        return res.redirect('/daaLab');
      }
      const url = process.env.MONGODB_URI;
      const dbName = 'SmartLabApp';

      // Asynchronous function to getting question information of the submission and
      // compiling the submission agaist the question test cases
      (async function check() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly  to server');

          const db = client.db(dbName);
          const col = db.collection('daaQuestions'); // for fetching question
          const col1 = db.collection('submissions'); // for updating submission later

          // getting question from database
          const question = await col.findOne({ _id: new ObjectID(req.body.questionId) });

          // Initialize score and description(result)
          let score = 0;
          let des = 'Passed';
          let code;

          // fetching code from file
          try {
            code = fs.readFileSync(`uploads/${fileName}`, 'utf8');
          } catch (e) {
            debug('Error:', e.stack);
          }

          // Making config to pass in heackerearth API
          const config = {};
          config.time_limit = 1;
          config.memory_limit = 323244;
          config.source = code;
          config.language = req.body.lang;

          // loop through all test cases
          await (async function execute() {
            let i;
            try {
              for (i = 0; i < question.testCases.length; i += 1) {
                config.input = question.testCases[i].input;
                let res = await hackerearth.run(config, (err, response) => {
                  if (err) {
                    debug(err);
                  } else {
                    return response;
                  }
                });

                // change res to JSON
                res = JSON.parse(res);
                // debug(res.run_status.status);
                debug(res);
                if (res.run_status.status === 'AC') { // if compile successfully
                  let ans = res.run_status.output;

                  // if answer is right then add 1 to score
                  debug(ans);
                  if (ans === question.testCases[i].output) {
                    score += 1;
                  }
                } else if (res.run_status.status === 'RE') { // if run time error
                  des = 'Run-time Error';
                  break;
                } else if (res.run_status.status === 'CE') { // if compiled unsuccessfully
                  des = 'Compile-time Error';
                  break;
                } else {
                  debug(res);
                  break;
                }
              }
            } catch (err) {
              debug(err);
            }
          }());

          // Changing result from passed to partial passed if score is not full
          if (des === 'Passed') {
            if (score === 0) {
              des = 'Wrong answer';
            } else if (score !== question.testCases.length) {
              des = 'Partial Passed';
            }
          } else {
            score = 0;
          }

          // Making score a to (a / b) for display in ejs
          score = `${score} / ${question.testCases.length}`;

          // Making a string equal to current date and time as date_time
          const today = new Date();
          const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;
          const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
          const dateTime = `${date} ${time}`;

          // delete file
          fs.unlink(`uploads/${fileName}`, (err) => {
            if (err) throw err;
            // if no error, file has been deleted successfully
            debug('File deleted!');
          });

          // Making Submission ready to push in database
          const submission = {};
          submission.time = dateTime;
          submission.code = code;
          submission.laguage = req.body.lang;
          submission.score = score;
          submission.result = des;
          submission.questionId = req.body.questionId;
          submission.userId = req.user._id;
          debug(submission);

          // Add Submission to database
          const result = await col1.insertOne(submission);
          return res.render(
            'daaQuestion',
            {
              question,
              username: req.user.username,
              score: submission.score, // sending score and result to html
              result: submission.result
            }
          );
        } catch (err) {
          debug(err);
        }
      }());
    });
  }
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/student/login');
    }
  }
  return {
    getById,
    getIndex,
    middleware,
    putById
  };
}

module.exports = daaLabController;
