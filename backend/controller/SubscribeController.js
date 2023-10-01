const { Model, json } = require("sequelize");
const Users = require("../models/UserModel");
const Subscribe = require("../models/SubscribeModel");

const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");

// subscribe,unsubscribe, get following list, get followers list

const UserSubscribe = asyncHandler(async (req, res) => {
    const { authorId } = req.body;
    userId = req.user.id
    const author = await Users.findByPk(authorId)

    if (!author) {
        res.status(404)
        throw new Error("author invalid")
    }
    if (author.role != "2") {
        res.status(403)
        throw new Error("You can`t subscribe on this type of user")
    }

    const checkUnique = await Subscribe.findOne({
        where: {
            userId: userId,
            authId: authorId
        }
    })
    if (checkUnique) {
        res.status(403)
        throw new Error("user already subs")
    }


    await Subscribe.create({
        userId: userId,
        authId: authorId
    })
    res.status(200).json({message:"user successfully subscribe",user:author})



})
const UserUnsubscribe = asyncHandler(async (req, res) => {
    const { authorId } = req.body;
    userId = req.user.id


    const SubItem = await Subscribe.findOne({
        where: {
            userId: userId,
            authId: authorId
        }
    })

    if (SubItem) {
        await SubItem.destroy()
        res.status(200).json("user unfollow")
    } else {
        res.status(400)
        throw new Error("user not follow")
    }


});
const UserFollowers = asyncHandler(async (req, res) => {
    AuthId = req.params.id
    const followers = await Subscribe.findAll({
        include: [
            {
                model: Users,
                as: "Subscriber",
                attributes: ['fullName', 'username', 'photo', 'role', 'id']
            }
        ],
        where: { authId: AuthId },
        attributes: []
    });
    res.json(followers)
})

const UserFollowing = asyncHandler(async (req, res) => {
    userId = req.params.id
    const followers = await Subscribe.findAll({
        include: [
            {
                model: Users,
                as: "Author",
                attributes: ['fullName', 'username', 'photo', 'role', 'id']
            }
        ],
        where: { userId: userId },
        attributes: []
    });
    res.json(followers)
})

const isUserFollow = asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const authorId = req.params.authId
    const checkUnique = await Subscribe.findOne({
        where: {
            userId: userId,
            authId: authorId
        }
    })
    if (checkUnique) {
        return res.status(200).json({"follow":true,"info":checkUnique})
    }
    else{
        return res.status(404).json({"follow":false})

    }
})
module.exports = { UserSubscribe,isUserFollow, UserUnsubscribe, UserFollowers, UserFollowing }