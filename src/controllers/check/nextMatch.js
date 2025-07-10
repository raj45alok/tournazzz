const Teams = require('../../models/team');
const Tournaments = require('../../models/tournament');

const nextMatch = async (req, res) => {
    const { username } = req.query;

    if(!username) {
        return res.json({success: false, msg: 'Username not provided'});
    }

    const listOfTeams = await Teams.find().byMemberUsername(username);
    // console.log(listOfTeams);
    for(const team of listOfTeams) {
        const tempTeamName = team.teamName.toLowerCase();

        const listOfTournaments = await Tournaments.find().byTeamName(team.teamName);
        // console.log(listOfTournaments);
        for(const tournament of listOfTournaments) {

            for(const match of tournament.matches) {

                if((match.team1Name.toLowerCase() == tempTeamName || match.team2Name == tempTeamName) && match.winner ==""){
                    return res.json({
                        success:true, 
                        tournamentName: tournament.tournamentName,
                        organiserName: tournament.organiserName,
                        game: tournament.game,
                        matchId: match.matchId
                    });
                }
            }
        }
    }

    res.json({success: false, msg: 'No next match'});
}

module.exports = { nextMatch };