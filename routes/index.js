const express = require('express');

const router = express.Router();

const {
    ensureAuthenticated
} = require('../config/auth');

//Pagina inicial
router.get('/', (req, res) => {
    res.render('welcome')
})

//Panel de control
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
})

module.exports = router;