const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'An unknown error occurred'
  });
});

mongoose
.connect('mongodb+srv://emin:academind123@cluster0.ugfsqbu.mongodb.net/mern?retryWrites=true&w=majority')
.then(() => {
  app.listen(8080, () => {
    console.log('Example app listening on port 8080!');
  });
})
.catch((err) => {
   console.log(err);
});

app.listen(5000, () => {
  console.log('Example app listening on port 5000!');
});
