const { Sequelize, DataTypes } = require('sequelize');
const { sequelize, connectDB } = require("../config/dbConnection");
const Users = require('./UserModel');


const Article = sequelize.define("article", {
    header: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    views: {
        type: DataTypes.STRING,
        allowNull: true,
        len: [2, 20],
        default:0
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    }



},{paranoid:true});
Article.belongsTo(Users,{onDelete: 'CASCADE'})

module.exports = Article
