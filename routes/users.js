const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');

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

    //console.log(`Errores: ${errors.length} : Mensaje: ${msg}`);

    if (errors.length > 0) {

        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({
            email: email
        }).then(user => {
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
                });
                // Encriptar clave
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //cambiar la clave encriptada
                        newUser.password = hash;
                        //guardar el usuario
                        newUser.save().then(user => {
                                req.flash('success_msg', 'Ha sido registrado exitosamente, ahora puede iniciar sesión');
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err));

                    })
                })
            }

        })
        //.catch(err => console.log(err));
    }
})

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Cerrar sesión
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Adios');
    res.redirect('/users/login');

})

module.exports = router;