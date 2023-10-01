const {sequelize,connectDB} = require('../config/dbConnection');
const Users = require('./UserModel');
const Article = require('./ArticleModel');
const Subscribe = require('./SubscribeModel');
const Punishment = require('./PunishModel');


const syncModels = async () => {
  try {
    await Users.sync({ forse: true });

    await Article.sync({ forse: true });

    await Subscribe.sync({ forse: true });
    await Punishment.sync({ forse: true });

    console.log("All models were synchronized successfully.");

} catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

module.exports = {syncModels};

