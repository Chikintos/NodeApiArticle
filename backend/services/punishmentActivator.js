const cron = require('node-cron');
const Punishment = require("../models/PunishModel")
const { Op } = require("sequelize");
const Users = require('../models/UserModel');
const Article = require('../models/ArticleModel');
const logger = require("../config/loggerconfig")
const Punish = async () => {
    try {
        const currentTime = new Date().getTime();
        const { count, rows } = await Punishment.findAndCountAll({
            where: {
                status: "Active",
                punishment_datetime: {
                    [Op.lt]: currentTime
                }
            },
        })
    if (count===0) logger.info("NO PUNISH")
        for (var i = 0; i < count; i++) {
            var punish = rows[i].dataValues
            if (punish.punishment === 'DropArticle') {
                const art = await Article.findByPk(punish.articleId)
                if (art) {
                    await art.destroy()
                    rows[i].status = "Applied"
                    await rows[i].save()
                    logger.info(`DROP ARICLE WITH ID: ${art.dataValues.id}, ACCORDING TO PUNISH WITH ID: ${punish.id}`, )
                }
                else {
                    rows[i].status = "Applied"
                    await rows[i].save()
                    logger.error(`ARTICLE WITH ID: ${punish.articleId} NO FOUND, PUNISH ID: ${punish.id}`);
                }
            }
            if (punish.punishment === 'BanUser') {
                const user = await Users.findByPk(punish.userId)
                if (user) {
                    await user.destroy()
                    punish.status = "Solved"
                    await rows[i].save()
                    logger.info(`DROP USER WITH ID: ${user.dataValues.id}, ACCORDING TO PUNISH WITH ID: ${punish.id}`, )

                }
                else {
                    rows[i].status = "Applied"
                    await rows[i].save()
                    logger.error(`USER WITH ID: ${punish.userId} NOT FOUND, PUNISH ID: ${punish.id}`);

                }
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

cron.schedule('*/10 * * * * *', async () => {
    logger.info("PUNISHER START")
    await Punish();
    logger.info("PUNISHER DONE")

});
