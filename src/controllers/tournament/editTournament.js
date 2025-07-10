const Tournaments = require('../../models/tournament');
const singleElimFinalizeBracket = require('../../utils/singleElimFinalizeBracket');
const doubleElimFinalizeBracket = require('../../utils/doubleElimFinalizeBracket');

const getEditTournament = async (req, res) => {
    const { tournamentName, organiserName } = req.params;
    const currentTournament = await Tournaments.find().byTournamentName(tournamentName).byOrganiserName(organiserName);
    if(currentTournament.length == 0) {
        return res.json({ success: false, msg: 'Cannot find tournament' });
    }

    const { format, team, finalizeBracket } = req.query;

    if(format) {
        await Tournaments.findOneAndUpdate({
            tournamentName: {$regex: tournamentName, $options: 'i'}, 
            organiserName: {$regex: organiserName, $options: 'i'}}, 
            {format: format.toLowerCase()});
        console.log('Updated tournament format');
        return res.status(201).json({ success: true, msg: "Format updated" });
    }

    if(team) {
        let teamName = team.toString().toLowerCase()
        for(const team of currentTournament[0].teams) {
            if(team.teamName == teamName) {
                return res.json({ success: false, msg: 'Team already registered' });
            }
        }

        await Tournaments.findOneAndUpdate({
            tournamentName: {$regex: tournamentName, $options: 'i'},
            organiserName: {$regex: organiserName, $options: 'i'}}, 
            {$push: {teams: {teamName: teamName}}});
        console.log('Updated tournament team');

        return res.status(201).json({ success: true, msg: "Team added" });
    }

    if(finalizeBracket) {
        let numberOfTeams = currentTournament[0].teams.length;

        if(currentTournament[0].matches.length > 0) {
            return res.json({ success: false, msg: 'Bracket already exists' });
        }

        // For single elimination bracket
        if(currentTournament[0].format == 'se') {
            singleElimFinalizeBracket(currentTournament, numberOfTeams);
        }

        // For double elimination bracket
        if(currentTournament[0].format == 'de') {
            doubleElimFinalizeBracket(currentTournament, numberOfTeams);
        }

        return res.status(201).json({ success: true, msg: "Bracket finalized" });
    }

    res.json({ success: true, msg: "No change" });
}

const postEditTournament = async (req, res) => {
    const seedingData = req.body;
    const { tournamentName, organiserName } = req.params;
    const currentTournament = await Tournaments.find().byTournamentName(tournamentName).byOrganiserName(organiserName);
    
    if(currentTournament.length == 0) {
        return res.json({ success: false, msg: 'Cannot find tournament' });
    }

    // console.log(seedingData);

    if(!seedingData) {
        return res.json({success: false, msg: 'Seeding data doesnt exist'});
    }

    if(currentTournament[0].teams.length < seedingData.length) {
        return res.json({ success: false, msg: 'Number of teams mismatch'});
    }

    let successCount = 0;

    const updateTeamSeed = async () => {
        for(let i=0; i < seedingData.length; i++) {
            let currentTeam = seedingData[i].teamName;
            
            currentTournament[0].teams.forEach( (team) => {
                if(team.teamName.toLowerCase() == currentTeam.toLowerCase() ) {
                    team.seed = seedingData[i].seed;
                    
                    successCount++;
                }
            })
        }

        await currentTournament[0].save();
    }

    await updateTeamSeed();

    let tempMsg = `${successCount} teams seeded`
    console.log(tempMsg);
    res.status(201).json({ success: true, msg: tempMsg });
}

module.exports = {
    getEditTournament,
    postEditTournament
}