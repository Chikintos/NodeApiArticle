const { Sequelize, DataTypes } = require('sequelize');
const { sequelize, connectDB } = require("../config/dbConnection");
const Users = require('./UserModel');
const Article = require('./ArticleModel');



const Punishment = sequelize.define("Punishment", {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    punishment_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    punishment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['BanUser', 'DropArticle']]
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue:"Active",
        validate: {
            isIn: [['Active', 'Solved','Applied','Edit']]
        }
    }



}, { paranoid: true });
Punishment.belongsTo(Users,
    {
        foreignKey: 'adminId',
        as: 'admin',
        onDelete: 'CASCADE'

    })
        Punishment.belongsTo(Users,
    {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE'

    })
Punishment.belongsTo(Article,
    {
        foreignKey: 'articleId',
        as: 'article',
        onDelete: 'CASCADE'
    })

module.exports = Punishment
