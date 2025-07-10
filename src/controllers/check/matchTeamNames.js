const Tournaments = require('../../models/tournament');

const matchTeamNames = async (req, res) => {
    const { tournamentName, organiserName, matchId } = req.params;

    const currentTournament = await Tournaments.find().byTournamentName(tournamentName).byOrganiserName(organiserName);
    if(currentTournament.length == 0) {
        return res.json({ success: false, msg: 'Cannot find tournament' });
    }

    for(const match of currentTournament[0].matches) {
        if(match.matchId == matchId) {

            return res.json({
                success: true,
                team1Name: match.team1Name,
                team2Name: match.team2Name
            })
        }
    }

    res.json({ success: false, msg: 'Cannot find match' });

}

module.exports = { matchTeamNames };