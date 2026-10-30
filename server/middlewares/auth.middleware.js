const jwt = require("jsonwebtoken");
const { User } = require('./../models/index.js');
require('dotenv').config();

exports.revokedTokens = new Set();

exports.auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token || exports.revokedTokens.has(token)){
        return res.status(401).json({"error":"Vous devez être authentifié pour réaliser cette action."})
    }
    try{
        req.payload = jwt.verify(token,process.env.JWT_KEY);
    }catch(e){
        return res.status(401).json({"error":"Vous devez être authentifié pour réaliser cette action."})
    }
    const user = await User.findByPk(req.payload.id);
    if(!user){
        return res.status(401).json({"error":"Vous devez être authentifié pour réaliser cette action."})
    }
   
    req.token = token;
    req.user = { id: String(user.id), username: user.username };
    next();
}
