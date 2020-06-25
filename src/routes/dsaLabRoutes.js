const express = require('express');
const dsaLabcontroller = require('../contollers/dsaLabController');

const dsaLabRouter = express.Router();

function router() {
  const { getIndex, getById } = dsaLabcontroller();

  dsaLabRouter.route('/')
    .get(getIndex);
  dsaLabRouter.route('/:id')
    .get(getById);
  return dsaLabRouter;
}

module.exports = router;
