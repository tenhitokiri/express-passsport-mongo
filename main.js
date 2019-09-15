const express = require('express');

const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');

const flash = require('connect-flash');

const session = require('express-session');

const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

// seguir en 27:12

//Configuración de la Base de Datos
const db = require('./config/keys').MongoURI;

//Conectar a Mongo db
mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Conectada... xD'))
    .catch(err => console.log(err));

app.use(expressLayouts)
app.set('view engine', 'ejs')

//Body parser
app.use(express.urlencoded({
    extended: false
}));

// Express Session
app.use(session({
    secret: 'melita cat',
    resave: true,
    saveUninitialized: true
}))

//Mantener sesiones en passport
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

const port = process.env.PORT || 5000

app.use('/', require('./routes/index'))

app.use('/users', require('./routes/users'))

app.listen(port, console.log(`Servidor Ejecutandose en el puerto ${port}`));