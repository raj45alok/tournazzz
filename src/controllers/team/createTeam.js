const Teams = require("../../models/team");

const createTeam = async (req, res) => {
    const { teamName, teamGame } = req.body;
    let sameTeam = [];

    sameTeam = await Teams.find().byTeamName(teamName).byGame(teamGame);
    if (sameTeam.length > 0) {
        return res.json({ success: false, msg: "Team already exists" });
    }

    await Teams.create({
        teamName: teamName.toLowerCase(),
        game: teamGame.toLowerCase(),
        members: [],
    });
    console.log("Team created");

    res.status(201).json({ success: true, msg: "Team created" });
};

module.exports = { createTeam };
