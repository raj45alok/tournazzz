const Tournaments = require("../models/tournament");

const singleElimFinalizeBracket = async (currentTournament, numberOfTeams) => {
    console.log('Updating for single elim');
    if(numberOfTeams < 2) {
        return res.json({success: false, msg: 'Less than 2 teams in tournament' });
    }

    let matchCount = 0;
    let numberOfRounds = 1;
    while(true) {
        if(numberOfTeams <= Math.pow(2, numberOfRounds))
            break;
        numberOfRounds++;
    }
    currentTournament[0].rounds = numberOfRounds;

    let round1Matches = Math.pow(2, numberOfRounds-1);
    const matches = [
        [1, 2*round1Matches], 
        [round1Matches, round1Matches + 1],
        [round1Matches/2, 3*round1Matches/2 + 1],
        [round1Matches/2 + 1, 3*round1Matches/2],
        [round1Matches/4, 7*round1Matches/4 + 1],
        [3*round1Matches/4 + 1, 5*round1Matches/4],
        [round1Matches/4 + 1, 7*round1Matches/4],
        [3*round1Matches/4, 5*round1Matches/4 + 1]
    ]

    for( let i = 0; i < round1Matches; i++) {
        // currentTournament[0].matches.push();

        let bye = true;
        currentTournament[0].teams.forEach((team) => {
            if(team.seed == matches[i][1]) {
                bye = false;
                return;
            }
        })

        let tempMatchId = `r1-m${i+1}`;
        currentTournament[0].matches.push({ matchId: tempMatchId });
        // currentTournament[0].matches[matchCount].matchId = `r1-m${i+1}`

        currentTournament[0].teams.forEach( (team) => {
            if(team.seed == matches[i][0]) {
                currentTournament[0].matches[matchCount].team1Name = team.teamName;
                return;
            }
        })
        
        if(bye) {
            currentTournament[0].matches[matchCount].team2Name = "null";
        } else {
            currentTournament[0].teams.forEach( (team) => {
                if(team.seed == matches[i][1]) {
                    currentTournament[0].matches[matchCount].team2Name = team.teamName;
                    return;
                }
            })
        }

        currentTournament[0].matches[matchCount].winner = "";
        currentTournament[0].matches[matchCount].winnerNextMatch = `r2-m${Math.floor(i/2)+1}`;
        currentTournament[0].matches[matchCount].loserNextMatch = "null";
        matchCount++;
    } 
    numberOfRounds--;

    while(numberOfRounds > 0) {
        let roundMatches = Math.pow(2, numberOfRounds-1);
        let roundNumber = currentTournament[0].rounds - numberOfRounds + 1;
        for(let i = 0; i < roundMatches; i++) {
            let tempMatchId = `r${roundNumber}-m${i+1}`;
            currentTournament[0].matches.push({ matchId: tempMatchId });
            currentTournament[0].matches[matchCount].team1Name = "";
            currentTournament[0].matches[matchCount].team2Name = "";
            currentTournament[0].matches[matchCount].winner = "";
            if(numberOfRounds == 1) {
                currentTournament[0].matches[matchCount].winnerNextMatch = "null";
            } else {
                currentTournament[0].matches[matchCount].winnerNextMatch = `r${roundNumber + 1}-m${Math.floor(i/2)+1}`;
            }
            currentTournament[0].matches[matchCount].loserNextMatch = "null";
            matchCount++;
        }
        numberOfRounds--;
    }

    // currentTournament[0].matches.push({ matchId: 'gf' });
    // matchCount++;
    // numberOfRounds--;

    await currentTournament[0].save();
    console.log('Bracket added');
};

module.exports = singleElimFinalizeBracket;
