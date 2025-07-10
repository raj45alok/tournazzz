const router = require('express').Router();

const { createTeam } = require('../controllers/team/createTeam');
const { getEditTeam } = require('../controllers/team/editTeam');

router.route('/create').post(createTeam);
router.route('/edit/:game/:teamName').get(getEditTeam);

module.exports = router;