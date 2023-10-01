
const asyncHandler = require("express-async-handler")
const Emailvalidator = require("email-validator");
const Imagevalidator = require("image-validator");
const validateDate = require("validate-date");
const { use, param } = require("../routes/UserRouter");


const Loginhandler = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log({ email, password })
    if (!email || !password) {
        res.status(400);
        throw new Error("bad fields")
    }
    if (password.length < 8) {
        res.status(400);
        throw new Error("Password too short")
    }
    if (!Emailvalidator.validate(email)) {
        res.status(400);
        throw new Error("Email not valid")
    }
    next()


});

const UpdatePasswordhandler = asyncHandler(async (req, res, next) => {

    const { OldPassword, NewPassword } = req.body;
    UserId = req.params.id
    if (OldPassword === NewPassword){
        res.status(400);
        throw new Error("New Password can`t be same")
    }
    if (req.user.id != UserId && req.user.role !== 1) {
        res.status(403);
        throw new Error("You have not rigths")
    }
    if (!OldPassword || !NewPassword || OldPassword.trim().length < 8 || NewPassword.trim().length < 8) {
        res.status(400);
        throw new Error("Password invalid")
    }
    next()

})

const UpdateEmailhandler = asyncHandler(async (req, res, next) => {

    const { email } = req.body;
    UserId = req.params.id

    if (req.user.id != UserId && req.user.role !== 1) {
        res.status(403);
        throw new Error("You have not rigths")
    }
    if (!Emailvalidator.validate(email)) {
        res.status(400);
        throw new Error("Email not valid")
    }

    next()

})
const Registrationhandler = asyncHandler(async (req, res, next) => {
    const { username, email, role, password } = req.body
    console.log(req.body)
    console.log(username, email, role, password)
    const roles = ["0", "1", "2"]

    if (!username || !role || !email || !password) {
        res.status(400);
        throw new Error("bad fields")
    }

    if (!roles.includes(role)) {
        res.status(400);
        throw new Error("role invalid")
    }

    if (password.length < 8) {
        res.status(400);
        throw new Error("Password too short")
    }

    if (username.length < 5) {
        res.status(400);
        throw new Error("Username too short")
    }

    if (!Emailvalidator.validate(email)) {
        res.status(400);
        throw new Error("Email not valid")
    }

    next()


});

const Updatehandler = asyncHandler(async (req, res, next) => {
    const { username, role, firstname, lastname, birth_date } = req.body;
    const roles = ["0", "1", "2"]
    UserId = req.params.id

    console.log(req.body)
    if (req.user.id != UserId && req.user.role !== 1) {
        res.status(403);
        throw new Error("You have not rigths")
    }


    if (!username && !role && !firstname && !lastname && !birth_date) {
        res.status(400);
        throw new Error("no data to update")

    }

    if (username) {
        if (!username.trim()) {
            res.status(400);
            throw new Error("Username invalid")

        }
        if (username.length < 5) {
            res.status(400);
            throw new Error("Username too short")

        }
    }
    if (role) {
        if (!roles.includes(role)) {
            res.status(400);
            throw new Error("role invalid")
        }
        if (!username.length < 5) {
            res.status(400);
            throw new Error("role too short")

        }
    }
    if (firstname) {
        if (!firstname.trim()) {
            res.status(400);
            throw new Error("firstname invalid")
        }
        if (firstname.lenght < 2) {
            res.status(400);
            throw new Error("firstname validation error")
        }
    }
    if (req.files){
        if (!req.files.photo.name.endsWith(".JPG")){
            res.status(409)
            throw new Error("not support format, only jpg")
        }
    }
    if (birth_date) {
        if (!validateDate(birth_date, responseType = "boolean", dateFormat = "mm/dd/yyyy")) {
            res.status(400);
            throw new Error("birth date validation error")
        }
    }
    next()



});
const GetAllUsershandler = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 1) {
        res.status(403)
        throw new Error("You have no rights")
    }
    params = req.query
    if (!params.page || params.page <= 0) req.query.page = 1
    if (!params.offset || params.offset <= 0 || params.offset >= 40) req.query.offset = 10
    
    next()

})

const Deletehandler = asyncHandler(async (req, res, next) => {

    const UserId = parseInt(req.params.id)
    if (req.user.id != UserId && req.user.role !== 1) {
        res.status(403);
        throw new Error("You have no rights to delete")
    }
    next()

});

const GetUserhandler = asyncHandler(async (req, res, next) => {
    next()
})

module.exports = { Loginhandler,GetUserhandler,GetAllUsershandler, UpdatePasswordhandler, Registrationhandler, Updatehandler, UpdateEmailhandler, Deletehandler }