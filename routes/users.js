const express = require('express');

const router = express.Router();

//User model
const User = require('../models/User');

//bcrypt para encriptar claves
const bcrypt = require('bcryptjs');

//Login
router.get('/login', (req, res) => {
    res.render('login')
})

//Pagina de registro
router.get('/register', (req, res) => {
    res.render('register')
})

// Register handle
router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;

    let errors = [];
    let msg = '';

    //check req fields
    if (!name || !email || !password || !password2) {
        msg = 'Por favor llenar todos los campos';
        errors.push({
            msg
        })
    }

    // Verificar largo de contraseña
    if (password.length < 6) {
        msg = 'La contraseña debe ser de mas de 6 caracteres'
        errors.push({
            msg
        })
    }

    //Verificar claves iguales
    if (password2 !== password) {
        msg = 'Las contraseñas no coinciden';
        errors.push({
            msg
        })
    }

    console.log(`Errores: ${errors.length} : Mensaje: ${msg}`);

    if (errors.length > 0) {

        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //res.send('aceptado')
        //Buscar si el correo ya existe
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    //El correo Existe
                    //msg = 'El Correo indicado ya existe';
                    errors.push({
                        msg: 'El Correo indicado ya existe'
                    })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    //El Correo no existe
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                }
                console.log(newUser);
                res.send('sup');

            })
            .catch(err => console.log(err));
    }
})

module.exports = router;