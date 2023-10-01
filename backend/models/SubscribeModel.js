const { Sequelize, DataTypes } = require('sequelize');
const { sequelize, connectDB } = require("../config/dbConnection");
const Users = require('./UserModel');



  
const Subscribe = sequelize.define('subscribes', {
  }, { timestamps: false });


Subscribe.belongsTo(Users,
{  foreignKey: 'userId',
as: 'Subscriber',
onDelete: 'CASCADE'
})
Subscribe.belongsTo(Users,
  {  foreignKey: 'authId', 
  as: 'Author',
  onDelete: 'CASCADE'
})



module.exports = Subscribe