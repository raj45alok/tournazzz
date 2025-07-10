const Teams = require('../../models/team');

const myTeamName = async (req, res) => {
    const { game, username } = req.params;

    const currentTeam = await Teams.find().byGame(game).byMemberUsername(username);
    if(currentTeam.length == 0) {
        return res.json({ success: false, msg: 'Cannot find team' });
    }

    res.json({ success: true, teamName: currentTeam[0].teamName });

}

module.exports = { myTeamName };