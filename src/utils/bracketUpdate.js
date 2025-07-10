const Tournaments = require("../models/tournament");

const bracketUpdate = async (currentTournament, matchId) => {

    currentTournament[0].matches.forEach((match) => {
        if(match.matchId == matchId) {

            // For winner
            if(!(match.winnerNextMatch == "null")) {
                currentTournament[0].matches.forEach((nextMatch) => {
                    if(nextMatch.matchId == match.winnerNextMatch) {
                        if(nextMatch.team1Name == "") {
                            nextMatch.team1Name = match.winner;
                        } else {
                            nextMatch.team2Name = match.winner;
                        }
                    }
                })
            }

            // For loser
            if(!(match.loserNextMatch == "null")) {
                currentTournament[0].matches.forEach((nextMatch) => {
                    if(nextMatch.matchId == match.loserNextMatch) {
                        if(nextMatch.team1Name == "") {
                            nextMatch.team1Name = (match.winner.toLowerCase() == match.team1Name) ? match.team2Name : match.team1Name;
                        } else if(nextMatch.team2Name == ""){
                            nextMatch.team2Name = (match.winner.toLowerCase() == match.team1Name) ? match.team2Name : match.team1Name;
                        }
                    }
                })
            }

            return;
        }

    })

    await currentTournament[0].save();
}

module.exports = bracketUpdate;