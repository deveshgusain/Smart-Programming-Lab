const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParsre = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParsre.json());
app.use(bodyParsre.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'SmartLabApp' }));

require('./src/config/passport')(app);

app.use('/images', express.static(path.join(__dirname, 'assets/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const studentRouter = require('./src/routes/studentRoutes')();
const adminRouter = require('./src/routes/adminRoutes')();
const dsaLabRouter = require('./src/routes/dsaLabRoutes')();
const daaLabRouter = require('./src/routes/daaLabRoutes')();
const submissionRouter = require('./src/routes/submissionRoutes')();
const facultyRouter = require('./src/routes/facultyRoutes')();

app.use('/student', studentRouter);
app.use('/faculty', facultyRouter);
app.use('/admin', adminRouter);
app.use('/dsaLab', dsaLabRouter);
app.use('/daaLab', daaLabRouter);
app.use('/submissions', submissionRouter);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  debug(`server id running at port ${port}`);
});
