module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.flash('error_msg', "Debe Iniciar sesión para ver este recurso");
        res.redirect('/users/login');
    }

}