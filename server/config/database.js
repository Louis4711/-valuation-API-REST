const {Sequelize} = require('sequelize')
require('dotenv').config(); 

const database = new Sequelize(
    process.env.BD_NAME,
    process.env.BD_USER,
    process.env.BD_PASSWORD,
    {
        host: process.env.BD_HOST,
        dialect: process.env.BD_DIALECT,
        port: process.env.BD_PORT,
    }
);

module.exports = database; 