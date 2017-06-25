const mongoose = require('./mongoose');
const express = require('./express');
const passport = require('./passport');

const db = mongoose();
const app = express(db);

passport();

const User = require('./models/user.model');

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

module.exports = app;