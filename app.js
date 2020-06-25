const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParsre = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

app.use(bodyParsre.json());
app.use(bodyParsre.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const studentRouter = require('./src/routes/studentRoutes')();
const adminRouter = require('./src/routes/adminRoutes')();
const dsaLabRouter = require('./src/routes/dsaLabRoutes')();
const daaLabRouter = require('./src/routes/daaLabRoutes')();

app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/dsaLab', dsaLabRouter);
app.use('/daaLab', daaLabRouter);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  debug(`server id running at port ${port}`);
});
