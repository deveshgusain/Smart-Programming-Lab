const express = require('express');
const daaLabcontroller = require('../contollers/daaLabController');

const daaLabRouter = express.Router();

function router() {
  const { getIndex, getById } = daaLabcontroller();

  daaLabRouter.route('/')
    .get(getIndex);
  daaLabRouter.route('/:id')
    .get(getById);
  return daaLabRouter;
}

module.exports = router;
