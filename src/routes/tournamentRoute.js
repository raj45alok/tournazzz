const router = require('express').Router();

const { createTournament } = require('../controllers/tournament/createTournament');
const { getEditTournament, postEditTournament } = require('../controllers/tournament/editTournament');
const { infoTournament } = require('../controllers/tournament/infoTournament');
const { reportTournament } = require('../controllers/tournament/reportTournament');

router.route('/create').post(createTournament);
router.route('/edit/:organiserName/:tournamentName').get(getEditTournament).post(postEditTournament);
router.route('/info/:organiserName/:tournamentName').get(infoTournament);
router.route('/report/:organiserName/:tournamentName/:matchId').get(reportTournament);

module.exports = router;