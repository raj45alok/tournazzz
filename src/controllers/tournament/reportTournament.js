const Tournaments = require('../../models/tournament');
const bracketUpdate = require('../../utils/bracketUpdate');

const reportTournament = async (req, res) => {
    const { tournamentName, organiserName, matchId } = req.params;
    const currentTournament = await Tournaments.find().byTournamentName(tournamentName).byOrganiserName(organiserName);

    if(currentTournament.length == 0) {
        return res.json({ success: false, msg: 'Cannot find tournament' });
    }

    if(currentTournament[0].matches.length < 1) {
        return res.json({ success: false, msg: 'Bracket not finalized' });
    }

    const { winner } = req.query;

    
    if(winner) {
        let added = false;
        let updated = false;
        let wrongTeam = false;

        currentTournament[0].matches.forEach((match) => {
            if(match.matchId == matchId) {
                if(!(match.team1Name == winner.toLowerCase() || match.team2Name == winner.toLowerCase() )) {
                    wrongTeam = true;
                    return;
                }
                if(match.winner == "") {
                    added = true;
                }
                match.winner = winner.toLowerCase();
                updated = true;
                bracketUpdate(currentTournament, matchId);
                return;
            }
        })

        if(wrongTeam) {
            return res.json({ success: false, msg: 'Wrong team' });
        }

        if(!updated) {
            return res.json({ success: false, msg: 'Cannot find match' });
        }

        if(added) {
            return res.status(201).json({ success: true, msg: 'Winner added' });
        }
        return res.status(201).json({ success: true, msg: 'Winner updated' });
    }

    res.status(200).json({ success: true, msg: 'No changes'});
}

module.exports = { reportTournament };