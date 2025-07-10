const Tournaments = require('../../models/tournament')

const createTournament = async (req, res) => {
  const { tournamentName, organiserName, discordGuildInvite, startDate, endDate, tournamentGame } = req.body
  let success = true
  let sameTournament = []

  sameTournament = await Tournaments.find().byTournamentName(tournamentName).byOrganiserName(organiserName)
  if (sameTournament.length > 0) {
    return res.json({ success: false, msg: 'Tournament already exists' })
  }

  let discordInvite = discordGuildInvite ?? 'null'
  discordInvite = discordInvite.trim() == '' ? 'null' : discordInvite

  const newTournamentInfo = await Tournaments.create({
    tournamentName: tournamentName.toLowerCase(),
    organiserName: organiserName.toLowerCase(),
    discordGuildInvite: discordInvite,
    startDate: startDate,
    endDate: endDate,
    game: tournamentGame.toLowerCase(),
  })
  console.log('Tournament created')

  res.status(201).json({ sucess: true, msg: 'Tournament created' })
}

module.exports = { createTournament }
