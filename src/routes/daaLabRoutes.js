const express = require('express');
const daaLabcontroller = require('../contollers/daaLabController');

const daaLabRouter = express.Router();

function router() {
  const {
    getIndex, getById, middleware, putById
  } = daaLabcontroller();

  daaLabRouter.use(middleware);
  daaLabRouter.route('/')
    .get(getIndex);

  daaLabRouter.route('/:id')
    .get(getById)
    .post(putById);
  return daaLabRouter;
}

module.exports = router;
