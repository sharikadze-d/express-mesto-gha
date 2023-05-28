const express = require('express');
const mongoose = require('mongoose');

const router = require('./routes/index');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '645fa149db86dd4dd086b821',
  };

  next();
});
app.use(router);

app.listen(PORT, console.log(`Server started at port ${PORT}`));
