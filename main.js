const express = require('express');

const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');

const app = express();

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

const port = process.env.PORT || 5000

app.use('/', require('./routes/index'))

app.use('/users', require('./routes/users'))

app.listen(port, console.log(`Servidor Ejecutandose en el puerto ${port}`));