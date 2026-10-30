const database = require('../config/database.js');
const { DataTypes } = require('sequelize');

const Post = database.define('Post', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'posts'
});

module.exports = Post;