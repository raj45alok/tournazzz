const Tournaments = require('../../models/tournament');

const infoTournament = async (req, res) => {
    const { tournamentName, organiserName } = req.params;

    const currentTournament = await Tournaments.find().byTournamentName(tournamentName).byOrganiserName(organiserName);
    if(currentTournament.length == 0) {
        return res.json({ success: false, msg: 'Cannot find tournament' });
    }

    res.json({
        success: true,
        tournamentName: currentTournament[0].tournamentName,
        organiserName: currentTournament[0].organiserName,
        discordInvite: currentTournament[0].discordGuildInvite,
        startDate: currentTournament[0].startDate,
        endDate: currentTournament[0].endDate,
        game: currentTournament[0].game
    })

}

module.exports = { infoTournament };