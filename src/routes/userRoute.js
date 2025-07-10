const router = require('express').Router();
const discordUser = require('../models/user');

router.post('/:discordUsername', async (req, res) => {
    const { discordUsername } = req.params;
    const currentUser = await discordUser.find().byDiscordUsername(discordUsername);
    if(currentUser.length == 0) {
        return res.json({ success: false, msg: "Cannot find user" });
    }

    const gameData = req.body.gameData;
    if(!gameData) {
        return res.json({ success: false, msg: "Game data doesnt exist" });
    }

    let gamesAdded = 0;

    gameData.forEach((game) => {
        let sameGameCheck = false;
        currentUser[0].games.forEach((userGame) => {
            if(userGame == game.toLowerCase()) {
                sameGameCheck = true;
                return;
            }
        })

        if(!sameGameCheck) {
            currentUser[0].games.push(game.toLowerCase());
            gamesAdded++;
        }
    })

    await currentUser[0].save();
    res.status(201).json({ success: true, msg: ` ${gamesAdded} game(s) added in user profile` });
})

module.exports = router;