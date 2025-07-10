const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res) => {
    res.redirect('/auth/login');
})

router.get('/login', passport.authenticate('discord'));
router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/forbidden',
    successRedirect: '/'
}));

router.get('/logout', (req, res) => {
    if(req.user) {
        req.logout((err) => {
            if(err) {
                console.log(err);
                return next(err);
            }
        });
        res.redirect('/');
    } else {
        res.redirect('/');
    }
    console.log('User has logged out');
})

module.exports = router;