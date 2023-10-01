const asyncHandler = require("express-async-handler")
const { json } = require("sequelize")



const Createhandler = asyncHandler(async (req, res, next) => {


    const {userId,article_id,description,punishment_long,punishment}=req.body
    const punishments = ['BanUser', 'DropArticle']
    
    if (req.user.role !==1){
        res.status(403)
        throw new Error("NOT PERMISSION")
    }
    if ((!userId && !article_id) || !description || !punishment_long || !punishment){
        res.status(400)
        console.log(req.body)
        throw new Error("data invalid")
    }

    if (punishments && !punishments.includes(punishment)){
        res.status(400)
        throw new Error("punishments invalid")
    }
    if (!article_id && punishment && punishment==="DropArticle"){
        res.status(400)
        throw new Error("DropArticle data invalid")
    }
    if (punishment_long && isNaN(punishment_long)){
        res.status(400)
        throw new Error("punishment_long data invalid")
    }

    next()
})
const Edithandler = asyncHandler(async (req, res, next) => {
    const {punishment_id,description,punishment_long,punishment}=req.body

    if (req.user.role !==1){
        res.status(403)
        throw new Error("NOT PERMISSION")
    }
    if (isNaN(punishment_id) && !description && !punishment_long && !punishment){
        res.status(400)
        console.log(req.body)
        throw new Error("data invalid")
    }
    next()
})

const Gethandler = asyncHandler(async (req, res, next) => {
    next()
})

const MakeSolvedhandler = asyncHandler(async (req, res, next) => {
    if (req.user.role != 1) {
        res.status(403)
        throw new Error("You have not permission")
    }
    next()
})

const MakeActivehandler = asyncHandler(async (req, res, next) => {
    if (req.user.role != 1) {
        res.status(403)
        throw new Error("You have not permission")
    }
    next()
})

const GetByAdminhandler = asyncHandler(async (req, res, next) => {
    if (req.user.role != 1) {
        res.status(403)
        throw new Error("You have not permission")
    }
    next()
})
const GetByUserhandler = asyncHandler(async (req, res, next) => {
    const UserId = req.params.id
   
    if (UserId != req.user.id && req.user.role != 1) {
        res.status(403)
        throw new Error("You have not permission")
    }
    next()
})




module.exports = { Createhandler,MakeActivehandler,GetByAdminhandler,GetByUserhandler,Edithandler,Gethandler,MakeSolvedhandler}
