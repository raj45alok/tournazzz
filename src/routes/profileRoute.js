const router = require('express').Router();
const isAuthorize = require('../middleware/authorize');

router.get('/', isAuthorize, (req, res) => {
    res.status(200).send('Profile Page');
})

module.exports = router;