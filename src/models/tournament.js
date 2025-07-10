const mongoose = require('mongoose')

const TournamentSchema = new mongoose.Schema({
  tournamentName: { type: String, required: true, minLength: 3, maxLength: 20 },
  organiserName: { type: String, required: true, immutable: true, minLength: 3, maxLength: 20 },
  discordGuildInvite: { type: String, required: false, lowercase: true, minLength: 4, maxLength: 30 },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  game: { type: String, required: true, immutable: true },
  format: { type: String, required: false },
  teams: [
    {
      teamName: { type: String, required: true },
      seed: { type: Number, required: false, min: 1 },
    },
  ],
  rounds: { type: Number, required: false, min: 1 },
  wbRounds: { type: Number, required: false, min: 0 },
  lbRounds: { type: Number, required: false, min: 0 },
  matches: [
    {
      matchId: { type: String, required: true },
      team1Name: { type: String, required: false },
      team2Name: { type: String, required: false },
      winner: { type: String, required: false },
      winnerNextMatch: { type: String, required: false },
      loserNextMatch: { type: String, required: false },
    },
  ],
})

TournamentSchema.query.byTournamentName = function (name) {
  return this.where({ tournamentName: new RegExp(name, 'i') })
}

TournamentSchema.query.byOrganiserName = function (name) {
  return this.where({ organiserName: new RegExp(name, 'i') })
}

TournamentSchema.query.byGame = function (name) {
  return this.where({ game: new RegExp(name, 'i') })
}

TournamentSchema.query.byTeamName = function (name) {
  return this.where({ teams: { $elemMatch: { teamName: { $regex: new RegExp(name, 'i') } } } })
}

module.exports = mongoose.model('Tournaments', TournamentSchema)
