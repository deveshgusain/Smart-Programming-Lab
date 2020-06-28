/* eslint-disable no-underscore-dangle */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-else-return */
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:dsaLabController');
const fs = require('fs');
const multer = require('multer');
const
  {
    c, cpp, python, java
  } = require('compile-run');

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

function dsaLabController() {
  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'SmartLabApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);
        const col = await db.collection('dsaQuestions');
        const questions = await col.find().toArray();
        res.render(
          'dsaStudentLabTable',
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
    const url = 'mongodb://localhost:27017';
    const dbName = 'SmartLabApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        const db = client.db(dbName);
        const col = await db.collection('dsaQuestions');
        const question = await col.findOne({ _id: new ObjectID(id) });
        res.render(
          'dsaQuestion',
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

    // eslint-disable-next-line consistent-return
    upload(req, res, (err) => {
      // if file is empty or other error
      if (req.fileValidationError || !req.file || err instanceof multer.MulterError || err) {
        return res.redirect('/dsaLab');
      }

      const url = 'mongodb://localhost:27017';
      const dbName = 'SmartLabApp';

      // Asynchronous function to getting question information of the submission and
      // compiling the submission agaist the question test cases
      (async function check() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly  to server');

          const db = client.db(dbName);
          const col = db.collection('dsaQuestions'); // for fetching question
          const col1 = db.collection('submissions'); // for updating submission later
          const question = await col.findOne({ _id: new ObjectID(req.body.questionId) }); // getting question
          let score = 0;
          let des = 'Passed';

          // function for different language
          let fun;
          if (req.body.lang === 'cpp') {
            fun = cpp;
          } else if (req.body.lang === 'c') {
            fun = c;
          } else if (req.body.lang === 'java') {
            fun = java;
          } else {
            fun = python;
          }
          //  Asynchronous function to compiling code agaist all test cases
          await (async function execute() {
            let i;
            let res;
            try {
              for (i = 0; i < question.testCases.length; i += 1) { // loop through all test cases
                await fun.runFile(`uploads/${fileName}`, { stdin: question.testCases[i].input }, (err, result) => { // compiling using compile-run npm package
                  if (err) {
                    debug(err);
                  } else {
                    res = result;
                    debug(result);
                  }
                });
                if (res.exitCode === 0) { // if compiler successfully
                  const ans = res.stdout;
                  if (ans === question.testCases[i].output) { // if answer is right then add 1 to score
                    score += 1;
                  }
                } else { // if compiled unsuccecfully or run time error
                  des = `${res.errorType} error`;
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

          // fetching code from file
          let code;
          try {
            code = fs.readFileSync(`uploads/${fileName}`, 'utf8');
          } catch (e) {
            debug('Error:', e.stack);
          }

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

          // Add Submission to database
          // const result = await col1.insertOne(submission);
          return res.render(
            'dsaQuestion',
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

module.exports = dsaLabController;
