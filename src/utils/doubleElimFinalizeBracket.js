const Tournaments = require("../models/tournament");

const doubleElimFinalizeBracket = async (currentTournament, numberOfTeams) => {
    console.log('Updating for double elim');
    if(numberOfTeams < 2) {
        return res.json({success: false});
    }

    let matchCount = 0;

    let count = 0;
    while(true) {
        if(numberOfTeams <= Math.pow(2, count))
            break;
        count++;
    }
    let wbNumberOfRounds = count;
    let lbNumberOfRounds = 2*(count-1);

    currentTournament[0].wbRounds = wbNumberOfRounds;
    currentTournament[0].lbRounds = lbNumberOfRounds;

    let round1Matches = Math.pow(2, wbNumberOfRounds-1);
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

    // console.log(matches);

    for( let i = 0; i < round1Matches; i++) {
        // currentTournament[0].matches.push();

        let bye = true;
        currentTournament[0].teams.forEach((team) => {
            if(team.seed == matches[i][1]) {
                bye = false;
                return;
            }
        })

        let tempMatchId = `wb-r1-m${i+1}`;
        currentTournament[0].matches.push({ matchId: tempMatchId });
        // currentTournament[0].matches[matchCount].matchId = `wb-r1-m${i+1}`;

        // let team1arr = currentTournament[0].teams.find((team) => {
        //     team.seed == matches[i][1];
        // })
        // console.log(team1arr);

        currentTournament[0].teams.forEach( (team) => {
            if(team.seed == matches[i][0]) {
                currentTournament[0].matches[matchCount].team1Name = team.teamName;
                return;
            }
        })

        // currentTournament[0].matches[matchCount].team1Name = team1arr.teamName;

        if(bye) {
            currentTournament[0].matches[matchCount].team2Name = "null";
        } else {
            currentTournament[0].teams.forEach( (team) => {
                if(team.seed == matches[i][1]) {
                    currentTournament[0].matches[matchCount].team2Name = team.teamName;
                    return;
                }
            })
            // currentTournament[0].matches[matchCount].team2Name = team2arr.teamName;
        }

        currentTournament[0].matches[matchCount].winner = "";
        currentTournament[0].matches[matchCount].winnerNextMatch = `wb-r2-m${Math.floor(i/2) + 1}`;
        currentTournament[0].matches[matchCount].loserNextMatch = `lb-r1-m${Math.floor(i/2) + 1}`;
        matchCount++;
    } 
    wbNumberOfRounds--;

    while(wbNumberOfRounds > 0) {
        let roundMatches = Math.pow(2, wbNumberOfRounds-1);
        let roundNumber = currentTournament[0].wbRounds - wbNumberOfRounds + 1;
        for(let i = 0; i < roundMatches; i++) {
            let tempMatchId = `wb-r${roundNumber}-m${i+1}`;
            currentTournament[0].matches.push({ matchId: tempMatchId });
            currentTournament[0].matches[matchCount].team1Name = "";
            currentTournament[0].matches[matchCount].team2Name = "";
            currentTournament[0].matches[matchCount].winner = "";
            if(wbNumberOfRounds == 1) {
                currentTournament[0].matches[matchCount].winnerNextMatch = "gf";
            } else {
                currentTournament[0].matches[matchCount].winnerNextMatch = `wb-r${roundNumber + 1}-m${Math.floor(i/2) + 1}`;
            }
            if(roundNumber % 2 == 0) {
                currentTournament[0].matches[matchCount].loserNextMatch = `lb-r${(roundNumber-1)*2}-m${roundMatches-i}`;
            } else {
                currentTournament[0].matches[matchCount].loserNextMatch = `lb-r${(roundNumber-1)*2}-m${i+1}`;
            }
            // currentTournament[0].matches[matchCount].matchId = `wb-r${roundNumber}-m${i+1}`;
            matchCount++;
        }
        wbNumberOfRounds--;
    }

    while(lbNumberOfRounds > 0) {
        let roundMatches = Math.pow(2, Math.ceil(lbNumberOfRounds/2)-1);
        let roundNumber = currentTournament[0].lbRounds - lbNumberOfRounds + 1;
        for(let i = 0; i < roundMatches; i++) {
            let tempMatchId = `lb-r${roundNumber}-m${i+1}`;
            currentTournament[0].matches.push({ matchId: tempMatchId });
            currentTournament[0].matches[matchCount].team1Name = "";
            currentTournament[0].matches[matchCount].team2Name = "";
            currentTournament[0].matches[matchCount].winner = "";
            if(lbNumberOfRounds == 1) {
                currentTournament[0].matches[matchCount].winnerNextMatch = "gf";
            } else if(roundNumber % 2 == 0) {
                currentTournament[0].matches[matchCount].winnerNextMatch = `lb-r${roundNumber + 1}-m${Math.floor(i/2) + 1}`;
            } else {
                currentTournament[0].matches[matchCount].winnerNextMatch = `lb-r${roundNumber + 1}-m${i+1}`;
            }
            currentTournament[0].matches[matchCount].loserNextMatch = "null";

            // currentTournament[0].matches[matchCount].matchId = `lb-r${roundNumber}-m${i+1}`;
            matchCount++;
        }
        lbNumberOfRounds--;
    }

    currentTournament[0].matches.push({ matchId: 'gf' });
    currentTournament[0].matches[matchCount].team1Name = "";
    currentTournament[0].matches[matchCount].team2Name = "";
    currentTournament[0].matches[matchCount].winner = "";
    currentTournament[0].matches[matchCount].winnerNextMatch = "null";
    currentTournament[0].matches[matchCount].loserNextMatch = "null";
    matchCount++;

    await currentTournament[0].save();
    console.log('Bracket added');
};

module.exports = doubleElimFinalizeBracket;
