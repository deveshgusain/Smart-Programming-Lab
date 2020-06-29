const express = require('express');
const dsaLabcontroller = require('../controllers/dsaLabController');

const dsaLabRouter = express.Router();

function router() {
  const {
    getIndex, getById, middleware, putById
  } = dsaLabcontroller();

  dsaLabRouter.use(middleware);
  dsaLabRouter.route('/')
    .get(getIndex);

  dsaLabRouter.route('/:id')
    .get(getById)
    .post(putById);
  return dsaLabRouter;
}

module.exports = router;
