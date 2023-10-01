const asyncHandler = require("express-async-handler")
const { use } = require("../routes/UserRouter");

const CreateArticlehandler = asyncHandler(async (req, res, next) => {
    const { header, text, tags } = req.body
    if (!header || !text || !tags) {
        res.status(400)
        throw new Error("Fields error!")
    }
    if (text.length < 5 || header.length < 5) {
        res.status(400)
        throw new Error("text or header too short")  
    }
    if (req.user.role !== 2) {
        res.status(403)
        throw new Error("you have no rights ")  

    }
    next()


});
const articleUpdatehandler = asyncHandler(async (req, res, next) => {

    const { header, text, tags } = req.body;
    if (!header && !text && !tags) {
        res.status(400)
        throw new Error("No data to update")  
    }
    if (header && header.length < 5) {
        res.status(400)
        throw new Error("header invalid")  
    }

    if (text && text.length < 20) {
        res.status(400)
        throw new Error("text invalid")  
    }

    if (tags && tags.length < 5) {
        res.status(400)
        throw new Error("tags invalid")  
    }
    next()

});


const SearchArticlehandler = asyncHandler(async (req, res, next) => {
    params = req.query

    const tags = params.tags || undefined
    const search = params.search || undefined
    const page = parseInt(params.page) - 1 || 0
    var offset = parseInt(params.offset) || 50
    const authors = params.authors || ""

    if (!search || search.trim().length === 0) {
        res.status(400)
        throw new Error("Search is empty")  

    }
    if (page <= 0) {
        req.query.page = 1
    }
    if (tags && tags.trim() != "" && tags.length > 0) {
        req.query.tags = tags.split(',')
    }
    if (offset > 40 || offset < 5) {
        req.query.offset = 10
    }

    if (authors.trim()) {
        req.query.authors = authors.split(',').filter(val => !isNaN(val)).map(Number);
    } else {
        req.query.authors = undefined
    }
    next()


});



module.exports = { CreateArticlehandler,SearchArticlehandler,articleUpdatehandler }