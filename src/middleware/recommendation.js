const discordUser = require('../models/user');
const Tournaments = require('../models/tournament');

const limit = 4;

const recommendation = async (req, res, next) => {
    // console.log(req.user.games);

    let result = [];

    for(const game of req.user.games) {
        result.push(await Tournaments.find().byGame(game).limit(limit).exec());
    }

    return res.json({success: true, result });
    next();
}

module.exports = recommendation;