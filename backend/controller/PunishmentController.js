const { Model } = require("sequelize");
const Article = require("../models/ArticleModel")
const User = require("../models/UserModel")
const Punishment = require("../models/PunishModel")
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Users = require("../models/UserModel");
const { use } = require("../routes/PunishmentRouter");

// create Punishment+, edit Punishment+, delete Punishment+, getByUser+,getByAdmin+,SetSolved+,GetPunishment+

const PunishmentCreate = asyncHandler(async (req, res) => {

    const {  article_id, description, punishment_long, punishment } = req.body
    var {userId} = req.body 
    var result 

    const adminId = req.user.id
    if (!userId) {
        var art = await Article.findByPk(article_id)
        if (!art){
            res.status(404)
            throw new Error("ARTICLE NOT FOUND")
        }
        console.log(art,article_id)
        userId = art.userId
    } else {
        var user = await User.findByPk(userId)
        if (!user){
            res.status(404)
            throw new Error("USER NOT FOUND")
        }
    }


    const currentTime = new Date().getTime();
    const newTime = new Date(currentTime + (punishment_long * 1000));

    if (punishment === "BanUser") {
        var punish = await Punishment.findOne({where:{status:"Active",userId: userId}})
        if (punish){
            res.status(403)
            throw new Error("USER ALREADY HAVE A PUNISH")
        }
        result = await Punishment.create({
            description: description,
            punishment: punishment,
            adminId: adminId,
            punishment_datetime: newTime,
            userId: userId
        }
        )

    }
    if (punishment === "DropArticle") {
        
        var punish = await Punishment.findOne({where:{status:"Active",articleId: article_id}})
        if (punish){
            res.status(403)
            throw new Error("ARTICLE ALREADY HAVE A PUNISH")
        }

        result = await Punishment.create({
            description: description,
            punishment: punishment,
            adminId: adminId,
            punishment_datetime: newTime,
            userId: userId,
            articleId: article_id
        }
        )

    }
    res.json(result)

})

const PunishmentEdit = asyncHandler(async (req, res) => {

    const { punishment_id, description, punishment_long } = req.body

    punishment = await Punishment.findByPk(punishment_id)

    if (!punishment) {
        res.status(404)
        throw new Error("punishment not found")
    }


    if (description) punishment.description = description
    if (punishment_long) {
        const currentTime = new Date().getTime();
        const newTime = new Date(currentTime + (punishment_long * 1000));
        punishment.punishment_datetime = newTime
    }
    await punishment.save()
    res.json(punishment)

})

const PunishmentGet = asyncHandler(async (req, res) => {
    PunishmentId = req.params.id
    punishment = await Punishment.findByPk(PunishmentId)

    if (!punishment) {
        res.status(404)
        throw new Error("punishment not found")
    }

    if (punishment.userId != req.user.id && req.user.role != 1) {
        res.status(403)
        throw new Error("You have not permission")
    }
    res.status(200).json(punishment)

})
const PunishmentSetSolved = asyncHandler(async (req, res) => {
    PunishmentId = req.params.id

    punishment = await Punishment.findByPk(PunishmentId)
    if (!punishment) {
        res.status(404)
        throw new Error("punishment not found")
    }
    punishment.status = "Solved"
    await punishment.save()
    res.status(200).json(punishment)

})

const PunishmentSetActive = asyncHandler(async (req, res) => {
    PunishmentId = req.params.id

    punishment = await Punishment.findByPk(PunishmentId)
    if (!punishment) {
        res.status(404)
        throw new Error("punishment not found")
    }
    punishment.status = "Active"
    await punishment.save()
    res.status(200).json(punishment)

})
const ActivePunishmentGetByAdmin = asyncHandler(async (req, res) => {
    adminId = req.params.id
    const punishments = await Punishment.findAll({ where: { adminId: adminId,status:"Active" } })
    if (!punishments) {
        res.status(404)
        throw new Error("punishment not found")
    }

    res.status(200).json(punishments)

})
const UpdatedPunishmentByAdmin = asyncHandler(async (req, res) => {
    adminId = req.params.id
    const punishments = await Punishment.findAll({ where: { adminId: adminId,status:"Edit" } })
    if (!punishments) {
        res.status(404)
        throw new Error("punishment not found")
    }

    res.status(200).json(punishments)
})

const PunishmentGetByUser = asyncHandler(async (req, res) => {
    const UserId = req.params.id


    const punishments = await Punishment.findAll({
        where: {
            status: "Active",

            [Op.or]: [{ userId: UserId },
            { '$article.userId$': UserId }
            ],

        }, include: {
            model: Article,
            as: "article",
            attributes: ["id", "userId"]
        }
    });

    res.status(200).json(punishments)

})
module.exports = { PunishmentCreate, PunishmentEdit,PunishmentSetActive, PunishmentGetByUser,UpdatedPunishmentByAdmin, ActivePunishmentGetByAdmin, PunishmentGet, PunishmentSetSolved }