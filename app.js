const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use('/signin', login);
app.use('/signup', createUser);
app.use(auth, router);

app.use(errors());
app.use(handleError);

app.listen(PORT, console.log(`Server started at port ${PORT}`));
