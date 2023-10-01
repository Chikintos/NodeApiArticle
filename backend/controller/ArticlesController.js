const { Model } = require("sequelize");
const Article = require("../models/ArticleModel")
const User = require("../models/UserModel")
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Punishment = require("../models/PunishModel");
const { param } = require("../routes/UserRouter");
// get article, create article, search article,filters 


const articleCreate = asyncHandler(async (req, res) => {
    const { header, text } = req.body
    const tags = req.body.tags.split(",")
    try {
        const createdArticle = await Article.create({
            "header": header,
            "text": text,
            "tags": tags,
            "userId": req.user.id
        });
        res.json(createdArticle);
    } catch (error) {
        res.status(500)
        throw new Error(error)

    }
    

})


const articleGet = asyncHandler(async (req, res) => {
    const article = await Article.findByPk(req.params.id, {
        include: [{
            model: User,
            attributes: ['id', 'fullName', 'username', 'photo']
        }]
    })
    if (!article) {
        res.status(404)
        throw new Error("Article doesn`t exist")
    }
    res.status(200).json(article)
})

const articleSearch = asyncHandler(async (req, res) => {

    params = req.query
    console.log("PARAMS",params)
    const page = parseInt(params.page) - 1
    const search = params.search
    const tags = params.tags
    const offset = parseInt(params.offset)
    const authors = params.authors ? String(params.authors).split(",") : ""

    var sortby = params.sortby
    var sortColumn = "createdAt";
    var sortDir = "ASC";
    if (params.sortby) {
        var sortby = sortby.split(":");
        var allowedColumns = ["createdAt", "views"];
        var allowedDirs = ["DESC", "ASC"];
        if (sortby.length == 2) {
            [column, dir] = sortby;

            if (allowedColumns.includes(column)) {
                sortColumn = column;
            }
            if (allowedDirs.includes(dir)) {
                sortDir = dir;
            }
        }
    }

    let whereClause = {
        [Op.or]: [
            { header: { [Op.iLike]: `%${search}%` } },
        ]
    };

    if (tags) {
        whereClause[Op.or].push({ tags: { [Op.overlap]: tags } });
    }
    if (authors) {
        whereClause[Op.and] = { userId: {[Op.in]:authors} };
    }

    const { count, rows } = await Article.findAndCountAll({

        where: whereClause,
        include: [{
            model: User,
            attributes: ['id', 'fullName', 'username', 'photo']
        }],
        order: [[sortColumn, sortDir]],
        limit: offset,
        offset: offset * page
    });
    pagenum = Math.round(count / offset)
    articlelist = rows

    res.json({ data: articlelist, page_count: pagenum,page })


})
const articleUpdate = asyncHandler(async (req, res) => {
    try {
        const articleId = req.params.id;

        const { header, text, tags } = req.body;

        const article = await Article.findByPk(articleId);

        if (!article) {
            res.status(400)
            throw new Error("Article doesn`t exist")   
        }
        if (article.userId !== req.user.id && req.user.role !== 1) {
            res.status(403)
            throw new Error("You have no right to update this")   
        }
        if (header) article.header = header;
        if (tags) article.tags = tags.split(',');
        if (text) article.text = text;
        await article.save();
        punish= await Punishment.findOne({where:{articleId:article.id,status:"Active"}})
        if (punish){
            punish.status="Edit"
            await punish.save()
        }

        res.json({ message: "Article updated successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

const articleDelete = asyncHandler(async (req, res) => {
    articleId = req.params.id

    article = await Article.findByPk(articleId)
    if (!article) {
        res.status(404)
        throw new Error("article doesn`t exist")  
    }
    if (article.userId == req.user.id || req.user.role == 1) {
        article.destroy()
        res.status(200).json({ "message": "delete", data: article })

    }
    else {
        res.status(403)
        throw new Error("You have no right to delete this")  
    }
})

module.exports = { articleGet, articleCreate, articleSearch, articleDelete, articleUpdate }