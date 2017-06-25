const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const express = require('express');
const session = require('express-session');

const authorize = (req, res, next) => {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = function (db) {
    const app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'nyan cat'
    }));

    app.set('views', './views');
    app.set('view engine', 'ejs');

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.static(path.resolve(__dirname, 'public')));

    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });

    app.post('/login',
        passport.authenticate('local'), (req, res) => {
            res.redirect('/loggedIn');
        });

    app.get('/loggedIn',
        authorize,
        (req, res) => {
            res.render('loggedIn', { user: req.user });
        });

    app.get('/userdetails',
        authorize,
        (req, res) => {
            res.render('details', { user: req.user });
        });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    return app;
};