const mongoose = require('mongoose');
const Tournaments = require('../models/tournament');

const searchTournaments = async (req, res, next) => {
    const { name, limit } = req.query;
    let result= [];

    if(name) {
        result = await Tournaments.find().byTournamentName(name);
    }

    if(limit) {
        result = result.slice(0, Number(limit));
    }

    if(result.length < 1) {
        return res.json({ success: true, result: [] })
    }

    return res.json({ success: true, result: result});
    next();
}

module.exports = searchTournaments;