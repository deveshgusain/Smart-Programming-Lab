const express = require('express');
const submissionController = require('../controllers/submissionController');

const submissionRouter = express.Router();

function router() {
  const {
    allSub, middleware, code
  } = submissionController();

  submissionRouter.use(middleware);

  submissionRouter.route('/:user')
    .get(allSub);
  submissionRouter.route('/code/:id')
    .get(code);
  return submissionRouter;
}

module.exports = router;
