const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:dsaLabController');

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
            questions
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
            question
          }
        );
      } catch (err) {
        debug(err.stack);
      }
    }());
  }
  return {
    getById,
    getIndex
  };
}

module.exports = dsaLabController;
