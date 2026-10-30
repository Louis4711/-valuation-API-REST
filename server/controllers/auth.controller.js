const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const { fn, col, where } = require('sequelize');
const User = require('../models/user.model.js');
const { revokedTokens } = require('./../middlewares/auth.middleware.js');
require('dotenv').config();


const publicUser = (user) => ({ id: String(user.id), username: user.username });


const findByUsername = (username) => User.findOne({
    where: where(fn('LOWER', col('username')), username.toLowerCase())
});


const createToken = (user) => jwt.sign({
    id: String(user.id)
}, process.env.JWT_KEY, { expiresIn: '24h', jwtid: crypto.randomUUID() });

exports.register = async (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: "Les champs username et password sont obligatoires." });
    }
    const name = username.trim();
    if (name.length < 2 || name.length > 30) {
        return res.status(400).json({ error: "Le pseudo doit contenir entre 2 et 30 caractères." });
    }
    if (password.length < 6 || password.length > 128) {
        return res.status(400).json({ error: "Le mot de passe doit contenir entre 6 et 128 caractères." });
    }
    if (await findByUsername(name)) {
        return res.status(409).json({ error: "Ce pseudo est déjà utilisé." });
    }
    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3
    });
    let newUser = await User.create({
            username: name,
            password: hash
        });
   
    return res.status(201).json({ token: createToken(newUser), user: publicUser(newUser) });
}

exports.login = async (req, res) => {
    const { username, password } = req.body ?? {};
    const invalid = () => res.status(401).json({ error: "Pseudo ou mot de passe incorrect." });

    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
        return invalid();
    }
    const user = await findByUsername(username.trim());
    if (!user) {
        return invalid();
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
        return invalid();
    }
    return res.status(200).json({ token: createToken(user), user: publicUser(user) });
}

exports.me = (req, res) => {
    return res.status(200).json(req.user);
}

exports.logout = (req, res) => {
    revokedTokens.add(req.token);
    return res.status(204).end();
}
