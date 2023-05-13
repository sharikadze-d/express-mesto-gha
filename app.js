const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')

const PORT = 3000;

app.listen(PORT, () => console.log('Server started'));