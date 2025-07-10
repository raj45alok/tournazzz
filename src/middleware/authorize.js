const isAuthorize = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        console.log("Unauthorized page");
        return res.json({ success: false, msg: "User not logged in" });
    }
    
    next();
}

module.exports = isAuthorize;