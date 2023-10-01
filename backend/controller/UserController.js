const asyncHandler = require("express-async-handler")

const bcrypt = require("bcrypt")
const jwtoken = require("jsonwebtoken")
const Users = require("../models/UserModel");
const uuid = require("uuid")
const path = require('path');
const fs = require('fs');
const sharp = require("sharp");
const Punishment =require("../models/PunishModel")

const userGet = asyncHandler(async (req, res) => {
    UserId = req.params.id
    if (req.user) {
        attributes = ["id", "fullName", "username", "email", "photo", "birth_date", "role"]

    } else {
        attributes = ["id", "username", "miniphoto"]

    }
    user = await Users.findByPk(UserId, { attributes: attributes })
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    res.status(200).json({ user: user });
    
    
});
const userGetAll = asyncHandler(async (req, res) => {

    params = req.query

    const page = parseInt(params.page) - 1
    const offset = parseInt(params.offset)
    const uselist = await Users.findAll({
        where: {
            deletedAt: null
        },
        attributes: ['id', 'username', 'email', 'photo', 'birth_date', 'role'],
        limit: offset,
        offset: offset * page
    });
    res.json({ uselist: uselist, data: req.query })
})


const userRegistration = asyncHandler(async (req, res) => {
    const { username, email, role, password } = req.body

    user = await Users.findOne({ where: { email: email } })
    if (user) {
        res.status(409)
        throw new Error("User with this email already exist")
    }
    const hashPass = await bcrypt.hash(password, 10)
    await Users.create({
        username: username,
        email: email,
        role: role,
        password: hashPass
    })
    res.status(200).json(req.body)

})
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email: email } })

    if (user && (await bcrypt.compare(password, user.password))) {
        token = process.env.ACCESS_TOKEN_SECRET
        const accessToken = jwtoken.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role
            },

        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5h" }
        )
        res.status(200).json({
            accessToken, user: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role
            }
        })

    } else {
        res.status(401).json({ message: "Email or Password Wrong" })
    }
})

const userUpdateInfo = asyncHandler(async (req, res) => {
    try {
        const { username, role, firstname, lastname, birth_date } = req.body;
        UserId = req.params.id

        let user = await Users.findByPk(UserId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (username) user.username = username;
        if (role) user.role = role;
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
       
        if (req.files) {
            console.log(req.files)
            const { photo } = req.files;
            let filename = uuid.v4();
            const Path = path.resolve(__dirname, "..", "static", filename)
            await photo.mv(Path + ".jpg");
            await sharp(Path + ".jpg")
                .resize(1000)
                .jpeg({ quality: 90 })
                .toFile(Path + "-mini.jpg");
            if (user.photo) {
                fs.unlink(path.resolve(__dirname, "..", "static", user.photo + "-mini.jpg"), (err) => {
                    if (err) {
                        console.error(`${Path} DELETE: ${err}`);
                        return;
                    }
                });
                fs.unlink(path.resolve(__dirname, "..", "static", user.photo + ".jpg"), (err) => {
                    if (err) {
                        console.error(`${Path} DELETE: ${err}`);
                        return;
                    }
                });
            }
            user.photo = filename;
        }
        if (birth_date) user.birth_date = birth_date;

        await user.save();
        user = await Users.findByPk(UserId);
        punish= await Punishment.findOne({where:{userId:user.id,status:"Active"}})
        if (punish){
            punish.status="Edit"
            await punish.save()
        }
        return res.json({ message: "User information updated successfully", user: user });

    } catch (error) {
        console.log(error)
        res.status(500);
        throw new Error(error)
    }
});
const userUpdatePassword = asyncHandler(async (req, res) => {
    const { OldPassword, NewPassword } = req.body;
    UserId = req.params.id

    const user = await Users.findOne({ where: { id: UserId } })


    if (user && (await bcrypt.compare(OldPassword, user.password))) {
        const hashPass = await bcrypt.hash(NewPassword, 10)
        user.password = hashPass
        await user.save()
        res.status(200).json({ message: "Password Change" })

    } else {
        res.status(400).json({ message: "Email or Password Wrong" })
    }
})
const userUpdateEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const UserId = req.params.id
    const user = await Users.findOne({ where: { id: UserId } })
    const EmailExist = await Users.findOne({ where: { email: email } })

    if (user.email === email) {
        res.status(409)
        throw new Error("New email cant be equal to old")        
    
    }
    if (EmailExist) {

        res.status(409)
        throw new Error("User with this email already exist")        
    }
    user.email = email
    await user.save()
    res.status(200).json({ message: "Email update" });


})
const userDelete = asyncHandler(async (req, res) => {
    UserId = req.params.id

    user = await Users.findByPk(UserId, { attributes: ["id", "fullName", "email"] })
    if (!user) {
        
        res.status(404)
        throw new Error("user not found")                
    }
    else {
        await user.destroy()
        res.json({ message: "Delete", user: user })
    }



})

const userCurrent = asyncHandler(async (req, res) => {
    res.json({ message: req.user })
})




module.exports = { userGetAll, userRegistration, userGet, userLogin, userCurrent, userUpdateInfo, userUpdateEmail, userUpdatePassword, userDelete }