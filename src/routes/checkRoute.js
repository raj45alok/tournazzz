const router = require('express').Router();
const Teams = require('../models/team');
const Tournaments = require('../models/tournament');

const { matchTeamNames } = require('../controllers/check/matchTeamNames');
const { myTeamName } = require('../controllers/check/myTeamName');
const { nextMatch } = require('../controllers/check/nextMatch');

router.get('/login', (req, res) => {
    if(req.user) {
        res.json({sucess: true, login: true});
    } else {
        res.json({sucess: true, login: false});
    }
})

router.route('/match/:organiserName/:tournamentName/:matchId').get(matchTeamNames);
router.route('/team/:game/:username').get(myTeamName);
router.route('/nextMatch').get(nextMatch);



module.exports = router;