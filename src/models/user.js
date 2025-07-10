const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    discordUsername: { type: String, required: true },
    games: {type: Array, required: false },
});

UserSchema.query.byDiscordUsername = function(name) {
    return this.where({ discordUsername: new RegExp(name, 'i') });
}

const discordUser = module.exports = mongoose.model('Users', UserSchema);